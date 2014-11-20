__author__ = "Kellerberrin"

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
from drugdatabase import ForwardPromptJSON


class RequestSearchArgs(messages.Message):
    """Extract the drug database search arguments."""
    searchstring = messages.StringField(1, required=True)
    searchtype = messages.StringField(2, required=True)


class DrugSearchResult(messages.Message):
    """Return the json object"""
    resultMessage = messages.StringField(1)


class ForwardPromptArgs(messages.Message):
    """Extract the drug database search arguments."""
    promptstring = messages.StringField(1, required=True)
    prompttype = messages.StringField(2, required=True)
    promptsize = messages.StringField(3, required=True)


class ForwardPromptResult(messages.Message):
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

    FORWARD_PROMPT_RESOURCE = endpoints.ResourceContainer(
        ForwardPromptArgs,
        promptstring=messages.StringField(1, required=True),
        prompttype=messages.StringField(2, required=True),
        promptsize=messages.StringField(3, required=True)
    )

    @endpoints.method(FORWARD_PROMPT_RESOURCE
                      , ForwardPromptResult
                      , path="forwardPrompt"
                      , http_method="POST"
                      , name="forwardPrompt")
    def forwardprompt_implementation(self, request):
        return ForwardPromptResult(resultMessage=ForwardPromptJSON(request.promptstring,
                                                                   request.prompttype,
                                                                   request.promptsize))


application = endpoints.api_server([SearchUSDrugsApi],  restricted=False)
