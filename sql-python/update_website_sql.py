import MySQLdb
import io
import csv
import MySQLdb
import json
import re
import webapp2

import sql_info

import requests
from requests_toolbelt.adapters import appengine

appengine.monkeypatch()

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

def update_card_uris():
    # Get a csv reader of the GoogleDoc
    file_id = "1fVmB1TR9tLTbkJLIaEmV8ncWSOAplMA-VO5ViGbLtoI"
    url = "https://docs.google.com/spreadsheets/d/{0}/export?format=csv".format(file_id)

    r = requests.get(url)
    sio = io.StringIO(r.text, newline=None)
    reader = unicode_csv_reader(sio, dialect=csv.excel)

    db = MySQLdb.connect(user=sql_info.getUser(),
                         passwd=sql_info.getPasswd(),
                         host=sql_info.getHost(),
                         db=sql_info.getDb())

    for row in reader:
        # The first few rows of the googledoc have some explanatory data that
        # we want to skip.
        if row[1] == "" or row[1] == "Round 1 batch":
            print 'skipping one of the first rows'
            continue

        
        card_name = row[0]
        card_name = card_name.encode('utf-8')
        print "name of card: {}".format(card_name)
        card_name = MySQLdb.escape_string(card_name)
        card_name = card_name.strip()
        card_name.replace(" ", "+")
        #print "queryable card name is: {}".format(card_name)
        query_uri = "https://api.scryfall.com/cards/named?fuzzy=" + card_name;
        response = requests.get(query_uri)
        data = response.json()
        if "status" in data and data['status'] == 404:
            print "COULDN'T FIND AN IMAGE FOR {}".format(card_name)
            continue

        # Handle DFC case
        if not "image_uris" in data:
            image_uri = data['card_faces'][0]['image_uris']['normal']
        else:
            image_uri = data['image_uris']['normal']
        image_uri = MySQLdb.escape_string(image_uri)
        #print "image_uri is: {}".format(image_uri)

        query = """
            UPDATE mtgbracket_dev SET image_uri='{}' WHERE name='{}';
            """.format(image_uri, card_name)

        
        #print query
        
        cursor = db.cursor()
        cursor.execute(query)
        db.commit()
        cursor.close()
    db.close()

# Given a string ie '94.23%', return the float value of the string.
def get_score_from_string(percentage):
    return float(percentage[:-1])

def get_last_batch():
    db = MySQLdb.connect(user=sql_info.getUser(),
                         passwd=sql_info.getPasswd(),
                         host=sql_info.getHost(),
                         db=sql_info.getDb())
    query = """
            SELECT batch FROM last_batch WHERE name = 'last_batch';
            """ 
    print query
    
    cursor = db.cursor()
    cursor.execute(query)

    # TODO check there is only 1 value here
    for value in cursor:
        ret = value
    
    cursor.close()
    db.close()
    return ret[0]

def update_last_batch():
    # Get a csv reader of the GoogleDoc
    file_id = "1fVmB1TR9tLTbkJLIaEmV8ncWSOAplMA-VO5ViGbLtoI"
    url = "https://docs.google.com/spreadsheets/d/{0}/export?format=csv".format(file_id)

    r = requests.get(url)
    sio = io.StringIO(r.text, newline=None)
    reader = unicode_csv_reader(sio, dialect=csv.excel)

    i = 0
    for row in reader:
        if i > 5:
            break
        for elem in row:
            tokens = elem.split(" ");
            if tokens[0] == "(Round" or tokens[0] == "(Batch":
                round_num = int(tokens[1][:-1])
                batch_num = int(tokens[3][:-1])

                val = "B"
                if round_num < 10:
                    val += "0"
                val += str(round_num)
                val += "."
                if batch_num < 100:
                    val += "0"
                if batch_num < 10:
                    val += "0"
                val += str(batch_num)
                print val

                db = MySQLdb.connect(user=sql_info.getUser(),
                         passwd=sql_info.getPasswd(),
                         host=sql_info.getHost(),
                         db=sql_info.getDb())

                query = """
                    UPDATE last_batch SET batch = '{}' WHERE name = 'last_batch';
                    """.format(val)

                
                print query
                
                cursor = db.cursor()
                cursor.execute(query)
                db.commit()
                cursor.close()

                db.close()
        i += 1


def test_website():
    db = MySQLdb.connect(user=sql_info.getUser(),
                         passwd=sql_info.getPasswd(),
                         host=sql_info.getHost(),
                         db=sql_info.getDb())
    query = """
        INSERT INTO last_batch (name, batch) VALUES ('testing{}', 'foobar{}');
        """.format(randint(1, 100000), randint(1, 100000))

    
    print query
    
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()
    cursor.close()

    db.close()

# Returns whether this row needs to be updated.
def should_update_row(row, last_batch):
    tokens = last_batch.split(".");
    round_num = int(tokens[0][-1:])
    batch_num = int(tokens[1])
    #print "last_batch is: {} and {}".format(round_num, batch_num)
    for elem in row:
        if re.match("B[0-9]{2}\.[0-9]{3}", elem):
            elem_tokens = elem.split(".");
            elem_round = int(elem_tokens[0][-1:])
            elem_batch = int(elem_tokens[1])
            #print "round is: {} and {}".format(round_num, batch_num)
            #print "elem is: {} and {}".format(elem_round, elem_batch)
            if round_num < elem_round:
                return True
            if round_num <= elem_round and batch_num < elem_batch:
                return True
                #print "this round needs to be updated"
            #else:
                #print "doesn't need to be updated"
    return False

# Gets the GoogleDoc sheet for the bracket and updates the SQL db.
def update_sql():
    # Get a csv reader of the GoogleDoc
    file_id = "1fVmB1TR9tLTbkJLIaEmV8ncWSOAplMA-VO5ViGbLtoI"
    url = "https://docs.google.com/spreadsheets/d/{0}/export?format=csv".format(file_id)

    r = requests.get(url)
    sio = io.StringIO(r.text, newline=None)
    reader = unicode_csv_reader(sio, dialect=csv.excel)

    last_batch = get_last_batch()

    db = MySQLdb.connect(user=sql_info.getUser(),
                         passwd=sql_info.getPasswd(),
                         host=sql_info.getHost(),
                         db=sql_info.getDb())
    
    for row in reader:
        # The first few rows of the googledoc have some explanatory data that
        # we want to skip.
        if row[1] == "" or row[1] == "Round 1 batch":
            #print 'skipping one of the first rows'
            continue

        # Skip rows whose most recent batch has already been fully processed.
        if not should_update_row(row, last_batch):
            continue

        #print "row has {} elements".format(len(row))
        #for elem in row:
        #    print "element: {}".format(elem.encode('utf-8'))

        columns_to_insert = "("
        values_to_insert = "("
        values_to_update = ""

        # Construct the INSERT sql query.
        elem_index = 0
        for elem in row:
            elem = elem.encode('utf-8')
            elem = MySQLdb.escape_string(elem)
            if elem == "(bye)":
                elem_index += 1
                continue
            if elem == "":
                break
            if elem.lower() == "Still Open".lower():
                break
            columns_to_insert += "{}, ".format(column_names[elem_index])
            if column_names[elem_index].endswith("score"):
                values_to_insert += "\"{}\", ".format(get_score_from_string(elem))
            else:
                values_to_insert += "\"{}\", ".format(elem)
            if elem_index != 0: #Don't update name because it's the primary key
                if column_names[elem_index].endswith("score"):
                    values_to_update += "{}=\"{}\", ".format(column_names[elem_index], get_score_from_string(elem))
                else:
                    values_to_update += "{}=\"{}\", ".format(column_names[elem_index], elem)
            elem_index += 1
        columns_to_insert = columns_to_insert[:-2]
        columns_to_insert += ")"
        values_to_insert = values_to_insert[:-2]
        values_to_insert += ")"
        values_to_update = values_to_update[:-2]
        #query = """
        #    INSERT INTO mtgbracket_dev {} VALUES {} ON DUPLICATE KEY UPDATE {};
        #    """.format(MySQLdb.escape_string(columns_to_insert),
        #               MySQLdb.escape_string(values_to_insert),
        #               MySQLdb.escape_string(values_to_update))
        query = """
            INSERT INTO mtgbracket_dev {} VALUES {} ON DUPLICATE KEY UPDATE {};
            """.format(columns_to_insert, values_to_insert, values_to_update)

        
        #print query
        
        cursor = db.cursor()
        cursor.execute(query)
        db.commit()
        cursor.close()

    db.close()

    #disable for now; getting the last batch programatically is sorta broken.
    #for now we'll just update everything since round 5 automatically
    #if this is a problem i'll look into it more
    #update_last_batch()

def update128():
    #file = open("../php/www/mtgbracket/bracket_128/seeded_128_test.txt", "r") 
    #for line in file: 
    #    print line
    #file.close()
    print "writing to file now"
    file = open("../php/www/mtgbracket/bracket_128/compressed_128_test.txt", "w")
    file.write("I can write cross module\n")
    file.close()

def read128():
    print "reading from file now"
    file = open("../php/www/mtgbracket/bracket_128/compressed_128_test.txt", "r")
    for line in file: 
        print line
    file.close()

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello, World!')
        update_sql()
        update128()
        read128()

app = webapp2.WSGIApplication([
    ('/update_website_sql', MainPage),
], debug=True)

#print 'testing'
#update_sql()
#update128()
#update_last_batch()
#update_card_uris()