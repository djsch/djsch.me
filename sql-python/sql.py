import mysql.connector
import requests
import io
import csv

# show databases
# use <database>
# show tables
# descrbie <table>

def recreate_table():
	# mysql --host=35.226.225.147 --user=root --password
	db = MySQLdb.connect(user='root',
	                     passwd='therootpassword',
	                     host='35.226.225.147',
	                     db='mtgbracket')
	cursor = db.cursor()

	query = ("DROP TABLE mtgbracket_dev")
	cursor.execute(query)

	cursor = db.cursor()
	query = """

		CREATE TABLE IF NOT EXISTS mtgbracket_dev (
			name VARCHAR(200) NOT NULL,
			round_1_batch VARCHAR(20),
			round_1_opponent VARCHAR(200),
			round_1_score FLOAT(4, 2),
			round_2_batch VARCHAR(20),
			round_2_opponent VARCHAR(200),
			round_2_score FLOAT(4, 2),
			round_3_batch VARCHAR(20),
			round_3_opponent VARCHAR(200),
			round_3_score FLOAT(4, 2),
			round_4_batch VARCHAR(20),
			round_4_opponent VARCHAR(200),
			round_4_score FLOAT(4, 2),
			round_5_batch VARCHAR(20),
			round_5_opponent VARCHAR(200),
			round_5_score FLOAT(4, 2),
			round_6_batch VARCHAR(20),
			round_6_opponent VARCHAR(200),
			round_6_score FLOAT(4, 2),
			round_7_batch VARCHAR(20),
			round_7_opponent VARCHAR(200),
			round_7_score FLOAT(4, 2),
			round_8_batch VARCHAR(20),
			round_8_opponent VARCHAR(200),
			round_8_score FLOAT(4, 2),
			round_9_batch VARCHAR(20),
			round_9_opponent VARCHAR(200),
			round_9_score FLOAT(4, 2),
			round_10_batch VARCHAR(20),
			round_10_opponent VARCHAR(200),
			round_10_score FLOAT(4, 2),
			round_11_batch VARCHAR(20),
			round_11_opponent VARCHAR(200),
			round_11_score FLOAT(4, 2),
			round_12_batch VARCHAR(20),
			round_12_opponent VARCHAR(200),
			round_12_score FLOAT(4, 2),
			round_13_batch VARCHAR(20),
			round_13_opponent VARCHAR(200),
			round_13_score FLOAT(4, 2),
			round_14_batch VARCHAR(20),
			round_14_opponent VARCHAR(200),
			round_14_score FLOAT(4, 2),
			PRIMARY KEY(NAME));
		"""

	cursor.execute(query)

	#for (name, content, id) in cursor:
	#  print("{} said {}".format(
	#    name, content))

	cursor.close()
	db.close()	

def update_table():
	# mysql --host=35.226.225.147 --user=root --password
	db = MySQLdb.connect(user='root',
	                     passwd='therootpassword',
	                     host='35.226.225.147',
	                     db='mtgbracket')
	cursor = db.cursor()

	#query = ("SELECT * FROM entries")

	query = """
			"""

	cursor.execute(query)

	#for (name, content, id) in cursor:
	#  print("{} said {}".format(
	#    name, content))

	cursor.close()
	db.close()

#recreate_table()