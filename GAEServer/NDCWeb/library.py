__author__ = "kellerberrin"

package = "USDrugLibrary"

"""Search Drug API implemented using Google Cloud Endpoints.

Defined here are the ProtoRPC messages needed to define Schemas for methods
as well as those methods defined in an API.
"""


import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote

# import the database functionality
from drugdatabase import ReadNDCDatabaseJSON



class RequestSearchArgs(messages.Message):
    """Extract the drug database search arguments."""
    searchstring = messages.StringField(1, required=True)
    searchtype = messages.StringField(2, required=True)


class DrugSearchResult(messages.Message):
    """Return the json object"""
    resultMessage = messages.StringField(1)



@endpoints.api(name="searchUSdrugs", version="v1")
class SearchUSDrugsApi(remote.Service):
    """Search US Drugs API v1."""

    REQUEST_SEARCH_RESOURCE = endpoints.ResourceContainer(
        RequestSearchArgs,
        searchstring=messages.StringField(1, required=True),
        searchtype=messages.StringField(2, required=True)
    )

    @endpoints.method(REQUEST_SEARCH_RESOURCE
                      , DrugSearchResult
                      , path="typeSearch"
                      , http_method="POST"
                      , name="typeSearch")
    def search_implementation(self, request):
        return DrugSearchResult(resultMessage=ReadNDCDatabaseJSON(request.searchstring, request.searchtype, []))


application = endpoints.api_server([SearchUSDrugsApi],  restricted=False)
