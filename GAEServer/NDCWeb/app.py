import os
import logging
import webapp2


""" Create the HTML directory """

TEMPLATE_SEARCH_HTML = 'index.html'
TEMPLATE_DIRECTORY = 'html'
TEMPLATE_OS_DIR = os.path.join(os.path.dirname(__file__), TEMPLATE_DIRECTORY)
TEMPLATE_SEARCH_PATH = os.path.join(TEMPLATE_OS_DIR, TEMPLATE_SEARCH_HTML)

""" Global variables used to implement an NDC database search """         
SearchText = ""
SearchType = "name"
SearchArray = []



class SearchPage(webapp2.RequestHandler):
    def get(self):
        """ Display the search index page. """

        handle = open(TEMPLATE_SEARCH_PATH, "r")

        self.response.write(handle.read())


class GetSearchString(webapp2.RequestHandler):

    def post(self):
        " Callback to handle NDC search keys posted by the HTML search form."                                 
        global SearchText
        global SearchType
        global SearchArray
        
        SearchText = self.request.get('searchstring')
        SearchType = self.request.get('searchtype')
        
        if SearchType == "ndc":
            SearchText = SearchText.replace("-", "")
        else:
            SearchText = SearchText.upper()
  
        SearchText = SearchText.strip()
 
        SearchPage(self)
        		                                 

class GetSearchStringJSON(webapp2.RequestHandler):

    def post(self):
        " Callback to handle NDC search keys posted by the HTML search form."
        global SearchText
        global SearchType
        global SearchArray

        SearchText = self.request.get('searchstring')
        SearchType = self.request.get('searchtype')

        if SearchType=="ndc":
            SearchText = SearchText.replace("-","")
        else:
            SearchText = SearchText.upper()

        SearchText = SearchText.strip()

        SearchPage(self)


class GetNDC(webapp2.RequestHandler):

    def get(self):
        " Callback to handle an NDC request selected using a table link"                                 
        global SearchText
        global SearchType
        global SearchArray
        
        SearchText = self.request.get('ndc')
        SearchText = SearchText.replace("-","")
        SearchText = SearchText.strip()

        SearchType = "ndc"
  
        SearchPage(self)


class GetIngredients(webapp2.RequestHandler):

    def post(self):
        " Callback to handle an ingredient search posted by the HTML search form."                                 
        global SearchText
        global SearchType
        global SearchArray
        
        SearchArray = []
        SearchType = "ingredient"

        Count = self.request.get('active-count')
        i = 1
        while i <= int(Count) :
            VarKey = "searchtype-" + str(i)
            Type = self.request.get(VarKey)
            logging.info('Type: %s', Type)
            VarKey = "ingredient-" + str(i)
            Ingredient = self.request.get(VarKey)
            logging.info('Ingredient: %s', Ingredient)
            VarKey = "strength-" + str(i)
            Strength = self.request.get(VarKey)
            logging.info('Strength: %s', Strength)
            VarKey = "units-" + str(i)
            Units = self.request.get(VarKey)
            logging.info('Units: %s', Units)
            SearchTuple = (Type, Ingredient, Strength, Units)
            SearchArray.append(SearchTuple)
            i = i + 1
         
        SearchPage(self)

		
application = webapp2.WSGIApplication([
    ('/', SearchPage),
    ('/searchdb', GetSearchString),
    ('/selectndc', GetNDC),
    ('/searchingredients', GetIngredients),
], debug=True)

