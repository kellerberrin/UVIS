__author__ = "Kellerberrin"

package = "ProductAuthentication"

"""Product Authentication using cryptographic signatures and X509 certificates."""


import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote



class RequestGoogleCaptcha(messages.Message):
    """Extract the drug database search arguments."""
    publickey = messages.StringField(1, required=True)
    response = messages.StringField(2, required=True)

class CaptchaResult(messages.Message):
    """Return the json object"""
    resultMessage = messages.StringField(1)


@endpoints.api(name="productAuth", version="v1")
class ProductAuthentication(remote.Service):
    """Product Authentication API v1."""

    REQUEST_CAPTCHA_RESOURCE = endpoints.ResourceContainer(
        RequestGoogleCaptcha,
        searchstring=messages.StringField(1, required=True),
        searchtype=messages.StringField(2, required=True),

    )

    @endpoints.method(REQUEST_CAPTCHA_RESOURCE
                      , CaptchaResult
                      , path="captcha"
                      , http_method="POST"
                      , name="captcha")
    def captcha_implementation(self, request):
        return CaptchaResult(resultMessage="Dummy Result")

application = endpoints.api_server([ProductAuthentication],  restricted=False)
