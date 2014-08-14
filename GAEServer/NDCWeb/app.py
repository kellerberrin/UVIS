import os
import urllib
import logging


import jinja2
import webapp2

from drugdatabase import ReadNDCDatabase

def NotEmptyArray(Array):
    "Simple Custom Tests for JinJa. Tests for Empty Array"
    return len(Array) > 0    

def SingleElementArray(Array):
    "Simple Custom Test for JinJa. Tests for Single Element Array"
    return len(Array) == 1    

""" Create the JinJa Environment """         
JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
    
""" Register the utility functions with JinJa """         
JINJA_ENVIRONMENT.tests["NotEmptyArray"] = NotEmptyArray
JINJA_ENVIRONMENT.tests["SingleElementArray"] = SingleElementArray
        

""" Global variables used to implement an NDC database search """         
SearchText = ""
SearchType = "ndc"
        
        
class SearchPage(webapp2.RequestHandler):
    def get(self):
        " Call back to read the NDC database and display of the main page "
        global SearchText
        global SearchType

        template_values = ReadNDCDatabase(SearchText, SearchType)
                
        template = JINJA_ENVIRONMENT.get_template('/NDCSearch.html')        
        self.response.write(template.render(template_values))


class GetSearchString(webapp2.RequestHandler):

    def post(self):
        " Callback to handle NDC search keys posted by the HTML search form."                                 
        global SearchText
        global SearchType
        
        SearchText = self.request.get('searchstring')

        SearchType = self.request.get('searchtype')
        
        if SearchType=="ndc":
            SearchText = SearchText.replace("-","")
        else:
            SearchText = SearchText.upper()
  
        SearchText = SearchText.strip()
  
        self.redirect('/')
        		                                 

class GetNDC(webapp2.RequestHandler):

    def get(self):
        " Callback to handle an NDC request selected using a table link"                                 
        global SearchText
        global SearchType
        
        SearchText = self.request.get('ndc')
        SearchText = SearchText.replace("-","")
        SearchText = SearchText.strip()

        SearchType = "ndc"
  
        self.redirect('/')
		
		
application = webapp2.WSGIApplication([
    ('/', SearchPage),
    ('/searchdb', GetSearchString),
    ('/selectndc', GetNDC),
], debug=True)

