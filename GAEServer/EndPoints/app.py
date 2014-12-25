import os
import logging
import webapp2


""" Create the index HTML directory """

TEMPLATE_SEARCH_HTML = 'index.html'
TEMPLATE_DIRECTORY = 'html'
TEMPLATE_OS_DIR = os.path.join(os.path.dirname(__file__), TEMPLATE_DIRECTORY)
TEMPLATE_SEARCH_PATH = os.path.join(TEMPLATE_OS_DIR, TEMPLATE_SEARCH_HTML)


class SearchPage(webapp2.RequestHandler):
    """ Display the search index page. """
    def get(self):

        handle = open(TEMPLATE_SEARCH_PATH, "r")

        self.response.write(handle.read())

application = webapp2.WSGIApplication([('/', SearchPage)], debug=True)

