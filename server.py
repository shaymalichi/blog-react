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

print(db)

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', 'POST'])
def manage_posts():
	if request.method == 'GET':
		return get_all_posts()
	else:
		return add_city()


def get_all_posts():
	query = "select * from posts"
	cursor = db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	cursor.close()
	header = ['user_id','id','title','body', 'created_at']
	data = []
	for r in records:
		record_dict = dict(zip(header, r))
		record_dict['created_at'] = record_dict['created_at'].strftime("%Y-%m-%d %H:%M:%S")
		data.append(record_dict)
	return json.dumps(data)


#TODO

# def get_city(id):
# 	query = "select id, name, population from cities where id = %s"
# 	values = (id,)
# 	cursor = db.cursor()
# 	cursor.execute(query, values)
# 	record = cursor.fetchone()
# 	cursor.close()
# 	header = ['id', 'name', 'population']
# 	return json.dumps(dict(zip(header, record)))

@app.route('/new-post', methods=['POST'])
def add_city():
    data = request.get_json()
    query = "INSERT INTO posts (user_id, id, title, body, created_at) VALUES (%s, %s, %s, %s, %s)"
    values = (data['user_id'], data['id'], data['title'], data['body'], data['created_at'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_city_id = cursor.lastrowid
    cursor.close()

    # Return a response indicating the success of the operation
    return jsonify({'message': 'Post added successfully', 'new_city_id': new_city_id})


if __name__ == "__main__":
	app.run()