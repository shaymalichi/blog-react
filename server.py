# pip3 install mysql-connector-python
# pip3 install flask_cors

from flask import Flask, request
import mysql.connector as mysql
import json
from flask_cors import CORS

db = mysql.connect(
	host = "localhost",
	user = "root",
	passwd = "12345678",
	database = "new_schema")

print(db)

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', 'POST'])
def manage_cities():
	if request.method == 'GET':
		return get_all_posts()
	else:
		return add_city()

#only this implemented

def get_all_posts():
	query = "select user_id, id, title, body, created_at from posts"
	cursor = db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	cursor.close()
	print(records)
	# [(1, 'Herzliya', 95142), (2, 'Tel Aviv', 435855), (3, 'Jerusalem', 874186), (4, 'Bat Yam', 128898), (5, 'Ramat Gan', 153135), (6, 'Eilat', 47800), (7, 'Petah Tikva', 233577), (8, 'Tveriya', 41300)]
	header = ['user_id','id','title','body'] # need to add time 
	data = []
	for r in records:
		data.append(dict(zip(header, r)))
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

# def add_city():
# 	data = request.get_json()
# 	print(data)
# 	query = "insert into posts (name, population) values (%s, %s)"
# 	values = (data['name'], data['population'])
# 	cursor = db.cursor()
# 	cursor.execute(query, values)
# 	db.commit()
# 	new_city_id = cursor.lastrowid
# 	cursor.close()
# 	return get_city(new_city_id)

if __name__ == "__main__":
	app.run()