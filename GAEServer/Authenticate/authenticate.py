#!/usr/bin/python
#
# Copyright: 	Kellerberrin 2015
# Author:	James McCulloch
#

import os
import logging
import json

import sys
sys.path.insert(0, "libs")
import requests


def verifyCaptcha(publickey, response, ipaddress):

    recaptchaSecretKey = "6LcEZQATAAAAAN7iDxjleVtnEtXyFvptf0fG9_Wx"  # Private key must match the Google public key
    recaptchaVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

    verifyParams = {"secret": recaptchaSecretKey, "response": response}

    request = requests.get(recaptchaVerifyURL, params=verifyParams)

    if request.status_code != requests.codes.ok:

        result = {"success": False, "error-codes": "Request Communication Error"}

    else:

        logging.info("Request headers %s, text %s", request.headers['content-type'], request.text)

        result = request.json()

    return result


def verifySerialCode(publickey, response, barcode, serialcode, ipaddress):

    return json.dumps(verifyCaptcha(publickey, response, ipaddress))

