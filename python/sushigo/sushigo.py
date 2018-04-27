#import requests
#import io
#import json
#import re
import webapp2

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello, World!')

app = webapp2.WSGIApplication([
    (r'/sushigo.py.*', MainPage),
], debug=True)