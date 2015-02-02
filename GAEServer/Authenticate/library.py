__author__ = "Kellerberrin"

package = "ProductAuthentication"

"""Product Authentication using cryptographic signatures and X509 certificates."""


import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote


from authenticate import verifySerialCode


class RequestVerifySerial(messages.Message):
    """Extract the drug database search arguments."""
    publickey = messages.StringField(1, required=True)
    response = messages.StringField(2, required=True)
    barcode = messages.StringField(3, required=True)
    serialcode = messages.StringField(4, required=True)
    ipaddress = messages.StringField(5, required=True)


class VerifySerialResult(messages.Message):
    """Return the json object"""
    resultMessage = messages.StringField(1)


@endpoints.api(name="productAuth", version="v1")
class ProductAuthentication(remote.Service):
    """Product Authentication API v1."""

    REQUEST_VERIFYSERIAL_RESOURCE = endpoints.ResourceContainer(
        RequestVerifySerial,
        publickey=messages.StringField(1, required=True),
        response=messages.StringField(2, required=True),
        barcode=messages.StringField(3, required=True),
        serialcode=messages.StringField(4, required=True),
        ipaddress=messages.StringField(5, required=True),

    )

    @endpoints.method(REQUEST_VERIFYSERIAL_RESOURCE
                      , VerifySerialResult
                      , path="verifySerial"
                      , http_method="POST"
                      , name="verifySerial")
    def verifyserial_implementation(self, request):
        return VerifySerialResult(resultMessage=verifySerialCode(request.publickey,
                                                                 request.response,
                                                                 request.barcode,
                                                                 request.serialcode,
                                                                 request.ipaddress))

application = endpoints.api_server([ProductAuthentication],  restricted=False)
