#!/usr/bin/python
#
# Copyright: 	Kellerberrin 2015
# Author:	James McCulloch
#

import os
import logging
import json

from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto import Random


import sys
#sys.path.append("libs")
sys.path.insert(0, "libs")
#sys.path.insert(0, os.path.join(os.path.dirname(__file__), "libs"))
import requests


def verifyCaptcha(publickey, response, ipaddress):

    recaptchaSecretKey = "6LcEZQATAAAAAN7iDxjleVtnEtXyFvptf0fG9_Wx"  # Private key must match the Google public key
    recaptchaVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

    verifyParams = {"secret": recaptchaSecretKey, "response": response}

    request = requests.get(recaptchaVerifyURL, params=verifyParams)

    if request.status_code != requests.codes.ok:
        commError = {"success": False, "error-codes": "Request Communication Error", "session-key": ""}
        return json.dumps(commError)

    verifyData = request.json()

    responseSignature = generateResponseSignature(response)

    verifyData.update({"session-key": str(responseSignature[0])})

    return json.dumps(verifyData)


def generateResponseSignature(response):

    randomGenerator = Random.new().read
    keyRSA = RSA.generate(1024, randomGenerator)
    hashSHA256 = SHA256.new(response).digest()
    signatureRSA = keyRSA.sign(hashSHA256, '')

    return signatureRSA


def verifyResponseSignature(response, signature, key):

    hashSHA256 = SHA256.new(reponse).digest()
    verified = key.verify(hashSHA256, signature)

    return verified
