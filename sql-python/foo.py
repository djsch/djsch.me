import MySQLdb
import requests
import io
import csv
import MySQLdb
import json
import re
import webapp2

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello, World!')

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)


#print 'testing'
#update_sql()
#update_last_batch()
#update_card_uris()
#sql_test()