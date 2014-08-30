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

""" Create the JinJa template directory """

#TEMPLATE_DIRECTORY = 'html'
#Template_OS_Dir = os.path.join(os.path.dirname(__file__), TEMPLATE_DIRECTORY)

TEMPLATE_SEARCH_HTML = 'NDCSearch.html'
Template_OS_Dir = os.path.dirname(__file__)

""" Create the JinJa Environment """         
JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(Template_OS_Dir),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
    
""" Register the utility functions with JinJa """         
JINJA_ENVIRONMENT.tests["NotEmptyArray"] = NotEmptyArray
JINJA_ENVIRONMENT.tests["SingleElementArray"] = SingleElementArray
        

""" Global variables used to implement an NDC database search """         
SearchText = ""
SearchType = "name"
SearchArray = []
        
        
class SearchPage(webapp2.RequestHandler):
    def get(self):
        " Call back to read the NDC database and display of the main page "
        global SearchText
        global SearchType
        global SearchArray

        template_values = ReadNDCDatabase(SearchText, SearchType, SearchArray)
                
        template = JINJA_ENVIRONMENT.get_template(TEMPLATE_SEARCH_HTML)        
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
		

class GetIngredients(webapp2.RequestHandler):

    def post(self):
        " Callback to handle an ingredient search posted by the HTML search form."                                 
        global SearchType
        global SearchArray
        
        SearchArray = []
        SearchType = "ingredient"

        Count = self.request.get('activecount')
        i = 1
        while i <= int(Count) :
            VarKey = "searchtype" + str(i)
            Type = self.request.get(VarKey)
            logging.info('Type: %s', SearchType)
            VarKey = "ingredient" + str(i)
            Ingredient = self.request.get(VarKey)
            logging.info('Ingredient: %s', Ingredient)
            VarKey = "strength" + str(i)
            Strength = self.request.get(VarKey)
            logging.info('Strength: %s', Strength)
            VarKey = "units" + str(i)
            Units = self.request.get(VarKey)
            logging.info('Units: %s', Units)
            SearchTuple = (Type, Ingredient, Strength, Units)
            SearchArray.append(SearchTuple)
            i = i + 1
         
        self.redirect('/')


		
application = webapp2.WSGIApplication([
    ('/', SearchPage),
    ('/searchdb', GetSearchString),
    ('/selectndc', GetNDC),
    ('/searchingredients', GetIngredients),
], debug=True)

