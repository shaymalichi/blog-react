# pip3 install mysql-connector-python
# pip3 install flask_cors

from flask import Flask, request
import mysql.connector as mysql
import json
from flask_cors import CORS
from flask import jsonify

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


app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', 'POST'])
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

@app.route('/post/<int:post_id>', methods=['GET'])
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


if __name__ == "__main__":
    app.run()
