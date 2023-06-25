# pip3 install mysql-connector-python
# pip3 install flask_cors
import uuid

from flask import Flask, request, make_response, abort
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
        return add_city()


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


# TODO
@app.route('/post', methods=['POST'])
def get_city():
    id = str(request.get_json()['id']) # query that gets the post by id
    return get_all_posts()

@app.route('/signup', methods=['POST'])
def add_user():
    data = request.get_json()
    query = "INSERT INTO users1 (username, created_at, password) VALUES (%s, %s, %s)"
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    print(hashed)
    values = (data['username'], data['created_at'], hashed)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_city_id = cursor.lastrowid
    cursor.close()
    return make_response()


@app.route('/new-post', methods=['POST'])
def add_city():
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


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    query_for_check_password = "SELECT username, password FROM users1 WHERE username = %s" #can be improved
    values_for_check_password = (username,)
    cursor = db.cursor()
    cursor.execute(query_for_check_password, values_for_check_password)
    record = cursor.fetchone()
    cursor.close()
    hashed_password = ""
    if record:
        hashed_password = record[1]
    else:
        print("is it here? after record false")
        abort(401)


    if bcrypt.hashpw(password.encode('utf-8'), hashed_password.encode('utf-8')) != hashed_password.encode('utf-8'):
        print(hashed_password)
        print("after checking the password hashing")
        abort(401)


    #sessions
    query_for_sessions = "INSERT INTO sessions (username, session_id) VALUES (%s, %s)"
    session_id = str(uuid.uuid4())
    values_for_sessions = (username, session_id)
    cursor = db.cursor()
    cursor.execute(query_for_sessions, values_for_sessions)

    db.commit()
    cursor.close()
    resp = make_response()
    resp.set_cookie("session_id", session_id)
    return resp


if __name__ == "__main__":
    app.run()


