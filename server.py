# pip3 install mysql-connector-python
# pip3 install flask_cors
import uuid
from datetime import datetime
from settings import password

from flask import Flask, request, make_response, abort, session
import mysql.connector as mysql
import json
#from flask_cors import CORS
from flask import jsonify
import bcrypt


pool = mysql.pooling.MySQLConnectionPool(
    host="localhost",
    user="root",
    passwd=password,
    database="new_schema",
    buffered=True,
    pool_size=5,
    pool_name="blog_shay"
)


# pool = mysql.pooling.MySQLConnectionPool( # the aws database
#     host="shay-amazing-batabase.cbrdyb6rueag.eu-central-1.rds.amazonaws.com",
#     user="admin",
#     passwd=password,
#     database="new_schema",
#     buffered=True,
#     pool_size=5,
#     pool_name="blos_shay"
#     )


app = Flask(__name__,
            static_folder='./build',
            static_url_path='/')
@app.route('/')
def index():
    return app.send_static_file('index.html')
#CORS(app)  - commented after adding proxy jason


@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return add_post()


def get_all_posts():
    db = pool.get_connection()
    query = "SELECT user_id, id, title, body, created_at from posts1"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    db.close()
    header = ['user_id', 'id', 'title', 'body', 'created_at']
    data = []
    for r in records:
        record_dict = dict(zip(header, r))
        record_dict['created_at'] = record_dict['created_at'].strftime("%Y-%m-%d %H:%M:%S")
        data.append(record_dict)
    return json.dumps(data)

@app.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    db = pool.get_connection()
    query = "select user_id, body, post_id from comments where post_id = %s"
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    records = cursor.fetchall()
    cursor.close()
    db.close()
    header = ['user_id', 'body', 'post_id']
    data = []
    for r in records:
        record_dict = dict(zip(header, r))
        data.append(record_dict)
    return json.dumps(data)


@app.route('/posts/<int:post_id>', methods=['GET', 'DELETE', 'POST'])
def handle_posts_id(post_id):
    if request.method == 'GET':
        return get_post(post_id)
    elif request.method == 'POST':
        return edit_post()
    else:
        return delete_post(post_id)



def get_post(post_id):
    db = pool.get_connection()
    query = "select user_id, id, title, body, created_at from posts1 where id = %s"
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    db.close()

    if record:
        header = ['user_id', 'id', 'title', 'body', 'created_at']
        record_dict = dict(zip(header, record))
        record_dict['created_at'] = record_dict['created_at'].strftime("%Y-%m-%d %H:%M:%S")
        return jsonify(record_dict)
    else:
        return jsonify({'error': 'Post not found'})


@app.route('/signup', methods=['POST'])
def add_user():
    db = pool.get_connection()
    data = request.get_json()
    cursor = db.cursor()
    query = "SELECT username FROM users1 WHERE username = %s"
    cursor.execute(query, (data['username'],))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        db.close()
        return jsonify(message="Username already exists"), 400
    query = "INSERT INTO users1 (username, created_at, password) VALUES (%s, %s, %s)"
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    values = (data['username'], data['created_at'], hashed)

    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    return make_response()


#@app.route('/new-post', methods=['POST'])
def add_post():
    db = pool.get_connection()
    data = request.get_json()
    query = "INSERT INTO posts1 (user_id, title, body, created_at) VALUES (%s, %s, %s, %s)"
    user = session_check()
    values = (user, data['title'], data['body'], data['created_at'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_city_id = cursor.lastrowid
    cursor.close()
    db.close()

    # Return a response indicating the success of the operation
    return jsonify({'message': 'Post added successfully', 'new_city_id': new_city_id})


def delete_post(post_id):
    db = pool.get_connection()
    user = session_check()
    query = "DELETE FROM posts1 WHERE id = (%s) AND user_id = (%s) ;"
    val = (post_id, user)
    cursor = db.cursor()

    try:
        cursor.execute(query, val)
        if cursor.rowcount == 0:
            raise Exception("Post not found or you don't have permission to delete it.")
        db.commit()
        return "Post deleted successfully"
    except Exception as e:
        db.rollback()
        return f"Error deleting post: {str(e)}"
    finally:
        cursor.close()
        db.close()

def get_user_id():
    username = session_check()
    if username == "":
        abort(401, "you cannot delete")
    db = pool.get_connection()
    query = "SELECT id FROM users1 WHERE username = %s"
    values = (username, )
    cursor = db.cursor()
    cursor.execute(query, values)
    user_id = cursor.fetchone()
    cursor.close()
    db.close()
    return user_id[0]


def edit_post():
    db = pool.get_connection()
    data = request.get_json()
    post_id = data['postid']
    content = data['content']
    user = session_check()
    query = "UPDATE posts1 SET body = (%s) WHERE id = (%s) AND user_id = (%s);"
    val = (content, post_id, user)
    cursor = db.cursor()

    try:
        cursor.execute(query, val)
        if cursor.rowcount == 0:
            raise Exception("Post not found or you don't have permission to edit it.")
        db.commit()
        return "Post edited successfully"
    except Exception as e:
        db.rollback()
        return f"Error editing post: {str(e)}"
    finally:
        cursor.close()
        db.close()


@app.route('/login', methods=['POST'])
def login():
    db = pool.get_connection()
    data = request.get_json()
    username = data['username']
    password = data['password']
    query_for_check_password = "SELECT username, password FROM users1 WHERE username = %s"
    values_for_check_password = (username,)
    cursor = db.cursor()
    cursor.execute(query_for_check_password, values_for_check_password)
    record = cursor.fetchone()
    cursor.close()
    db.close()

    if record:
        hashed_password = record[1]
        if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
            # Successful login
            session_id = str(uuid.uuid4())
            query_for_sessions = "INSERT INTO sessions (username, session_id) VALUES (%s, %s)"
            values_for_sessions = (username, session_id)
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute(query_for_sessions, values_for_sessions)
            db.commit()
            cursor.close()
            db.close()
            resp = jsonify({'success': True})
            resp.set_cookie("session_id", session_id)
            return resp
        else:
            # Incorrect password
            abort(401)
    else:
        # User not found
        abort(401)


@app.route('/logout', methods=['POST'])
def logout():
    db = pool.get_connection()
    username = session_check()
    session.clear()
    resp = make_response()
    resp.set_cookie("session_id", "", expires=datetime.now())
    query = "DELETE FROM sessions WHERE username = (%s);"
    value = (username,)
    cursor = db.cursor()
    cursor.execute(query, value)
    db.commit()
    cursor.close()
    db.close()
    return resp

@app.route('/sessions', methods=['GET'])
def session_check():
    db = pool.get_connection()
    session_id = request.cookies.get("session_id")
    if not session_id:
        return ""
    query = "select username from sessions WHERE session_id = %s"
    values = (session_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    username = cursor.fetchone()
    cursor.close()
    db.close()
    if username:
        print("what im returning username[0] is: ", username[0])
        return username[0]
    else:
        ""

@app.route('/comments', methods=['POST'])
def add_comment():
    db = pool.get_connection()
    data = request.get_json()
    username_that_commented = session_check()
    post_id = data['postid']
    content = data['content']
    query = "INSERT INTO comments (user_id, body, post_id) VALUES (%s, %s, %s);"
    query_values = (username_that_commented, content, post_id)
    cursor = db.cursor()
    y = cursor.execute(query, query_values)
    db.commit()
    cursor.close()
    db.close()
    return ""



if __name__ == "__main__":
    app.secret_key = '123'
    app.run()

