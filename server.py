# pip3 install mysql-connector-python
# pip3 install flask_cors
import uuid
from datetime import datetime

from flask import Flask, request, make_response, abort, session
import mysql.connector as mysql
import json
#from flask_cors import CORS
from flask import jsonify
import bcrypt

db = mysql.connect(
    host="localhost",
    user="root",
    passwd="12345678",
    database="new_schema")


# db = mysql.connect( # the aws database
#     host="shay-amazing-batabase.cbrdyb6rueag.eu-central-1.rds.amazonaws.com",
#     user="admin",
#     passwd="Shay12345678",
#     database="new_schema")


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
    print('test')
    query = "select * from posts1"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    header = ['user_id', 'id', 'title', 'body', 'created_at']
    data = []
    for r in records:
        record_dict = dict(zip(header, r))
        record_dict['created_at'] = record_dict['created_at'].strftime("%Y-%m-%d %H:%M:%S")
        data.append(record_dict)
    return json.dumps(data)

@app.route('/comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    query = "select * from comments where post_id = %s"
    print("after query written!")
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    records = cursor.fetchall()
    print("the records: ", records)
    cursor.close()
    header = ['user_id', 'body', 'post_id']
    data = []
    for r in records:
        record_dict = dict(zip(header, r))
        data.append(record_dict)
    return json.dumps(data)


@app.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    query = "select user_id, id, title, body, created_at from posts1 where id = %s"
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()

    if record:
        header = ['user_id', 'id', 'title', 'body', 'created_at']
        record_dict = dict(zip(header, record))
        record_dict['created_at'] = record_dict['created_at'].strftime("%Y-%m-%d %H:%M:%S")
        return jsonify(record_dict)
    else:
        return jsonify({'error': 'Post not found'})


@app.route('/signup', methods=['POST'])
def add_user():
    data = request.get_json()
    cursor = db.cursor()
    query = "SELECT username FROM users1 WHERE username = %s"
    cursor.execute(query, (data['username'],))
    existing_user = cursor.fetchone()
    print("the answer is :", existing_user)
    if existing_user:
        cursor.close()
        return jsonify(message="Username already exists"), 400
    query = "INSERT INTO users1 (username, created_at, password) VALUES (%s, %s, %s)"
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    print(hashed)
    values = (data['username'], data['created_at'], hashed)

    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return make_response()


@app.route('/new-post', methods=['POST'])
def add_post():
    data = request.get_json()
    query = "INSERT INTO posts1 (user_id, title, body, created_at) VALUES (%s, %s, %s, %s)"
    values = (data['user_id'], data['title'], data['body'], data['created_at'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_city_id = cursor.lastrowid
    cursor.close()

    # Return a response indicating the success of the operation
    return jsonify({'message': 'Post added successfully', 'new_city_id': new_city_id})


@app.route('/delete', methods=['POST'])
def delete_post():
    data = request.get_json()
    id = data['id']
    print("i know this works!!!!!!!!!!!")
    query = "DELETE FROM posts1 WHERE id = (%s);"
    val = (id,)
    cursor = db.cursor()
    cursor.execute(query, val)
    db.commit()
    cursor.close()
    return ""


# UPDATE posts1 SET body = 'yossi' where id = 23;
@app.route('/edit', methods=['POST'])
def edit_post():
    data = request.get_json()
    post_id = data['postid']
    content = data['content']
    print(post_id)
    print(content)
    query = "UPDATE posts1 SET body = (%s) where id = (%s);"
    val = (content, post_id)
    cursor = db.cursor()
    cursor.execute(query, val)
    db.commit()
    cursor.close()
    return ""


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    query_for_check_password = "SELECT username, password FROM users1 WHERE username = %s"
    values_for_check_password = (username,)
    cursor = db.cursor()
    cursor.execute(query_for_check_password, values_for_check_password)
    record = cursor.fetchone()
    cursor.close()

    if record:
        hashed_password = record[1]
        if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
            # Successful login
            session_id = str(uuid.uuid4())
            query_for_sessions = "INSERT INTO sessions (username, session_id) VALUES (%s, %s)"
            values_for_sessions = (username, session_id)
            cursor = db.cursor()
            cursor.execute(query_for_sessions, values_for_sessions)
            db.commit()
            cursor.close()
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
    data = request.get_json()
    username = data['username']
    session.clear()
    resp = make_response()
    resp.set_cookie("session_id", "", expires=datetime.now())
    query = "DELETE FROM sessions WHERE username = (%s);"
    value = (username,)
    cursor = db.cursor()
    cursor.execute(query, value)
    db.commit()
    cursor.close()
    return resp

@app.route('/sessions', methods=['GET'])
def session_check():
    query = "select username from sessions;"
    cursor = db.cursor()
    cursor.execute(query)
    username = cursor.fetchone()
    print("the username i got: ", username)
    if username:
        print("what im returning username[0] is: ", username[0])
        return username[0]
    else:
        return ""

@app.route('/comments', methods=['POST'])
def add_comment():
    data = request.get_json()
    username_that_commented = data['user']
    post_id = data['postid']
    content = data['content']
    query = "INSERT INTO comments (user_id, body, post_id) VALUES (%s, %s, %s);"
    query_values = (username_that_commented, content, post_id)
    cursor = db.cursor()
    y = cursor.execute(query, query_values)
    db.commit()
    print(y)
    print("something happend?")
    return ""



if __name__ == "__main__":
    app.secret_key = '123'
    app.run()


