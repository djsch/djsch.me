import MySQLdb
import io
import csv
import json
import re

import sql_info

#import requests
#from requests_toolbelt.adapters import appengine

#appengine.monkeypatch()

from random import *

column_names = ['name',
                'round_1_batch',
                'round_1_opponent',
                'round_1_score',
                'round_2_batch',
                'round_2_opponent',
                'round_2_score',
                'round_3_batch',
                'round_3_opponent',
                'round_3_score',
                'round_4_batch',
                'round_4_opponent',
                'round_4_score',
                'round_5_batch',
                'round_5_opponent',
                'round_5_score',
                'round_6_batch',
                'round_6_opponent',
                'round_6_score',
                'round_7_batch',
                'round_7_opponent',
                'round_7_score',
                'round_8_batch',
                'round_8_opponent',
                'round_8_score',
                'round_9_batch',
                'round_9_opponent',
                'round_9_score',
                'round_10_batch',
                'round_10_opponent',
                'round_10_score',
                'round_11_batch',
                'round_11_opponent',
                'round_11_score',
                'round_12_batch',
                'round_12_opponent',
                'round_12_score',
                'round_13_batch',
                'round_13_opponent',
                'round_13_score',
                'round_14_batch',
                'round_14_opponent',
                'round_14_score']

def unicode_csv_reader(unicode_csv_data, dialect=csv.excel, **kwargs):
    # csv.py doesn't do Unicode; encode temporarily as UTF-8:
    csv_reader = csv.reader(utf_8_encoder(unicode_csv_data),
        dialect=dialect, **kwargs)
    for row in csv_reader:
        # decode UTF-8 back to Unicode, cell by cell:
        yield [unicode(cell, 'utf-8') for cell in row]

def utf_8_encoder(unicode_csv_data):
    for line in unicode_csv_data:
        yield line.encode('utf-8')



def get_names():
    db = MySQLdb.connect(user=sql_info.getUser(),
                         passwd=sql_info.getPasswd(),
                         host=sql_info.getHost(),
                         db=sql_info.getDb())
    query = """
            SELECT name FROM mtgbracket_dev;
            """ 
    print query

    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    for value in cursor:
        for foo in value:
            print foo


    cursor.close()
    db.close()

get_names()

#print 'testing'
#update_sql()
#update_last_batch()
#update_card_uris()