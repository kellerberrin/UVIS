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


def mockVerification():
    """ This function returns a mock/test drug verification record """
    initialAntecedentCustodian = { "actorIdentifier": "FRR-GHU54847FjuHHfd-348", "actorClass": "Pharmaceutical Reseller", "actorName": "Atomic Pharmaceutical" }

    finalAntecedentCustodian = { "actorIdentifier": "45z-890gH99999D4789-290", "actorClass": "Retail Pharmacy", "actorName": "Acme Drugstore" }

    finalDescendentCustodian = { "actorIdentifier": "100-ljSa873JKs8756-390", "actorClass": "Retail Patient", "actorName": "John Doe" }

    firstTransaction = { "transIdentifier": "ghUJ4990-8ukGHYd"
                    , "transtype": "Create",   "transClass": "Prescription Drug Authenticate"
                    , "transZuluTime": { "year": 2014, "month": 12, "day": 3, "hour": 13, "minutes": 12, "seconds": 19, "msec": 286}
                    , "transPlaceName": "800 Montgomery St, Beatty, Nevada, USA", "transLocation": { "latitude":  36.912573, "longitude": -116.756246}
                    , "antecedentCustodian": initialAntecedentCustodian, "antecedentAuthoriation": "VGH987GHThjurKO34"
                    , "descendentCustodian": None }

    intertransaction = { "transIdentifier": "aslkfjU89hgHJU890"
                    , "transtype": "Final",   "transClass": "Prescription Drug Purchase"
                    , "transZuluTime": { "year": 2015, "month": 1, "day": 15, "hour": 11, "minutes": 37, "seconds": 41, "msec": 682}
                    , "transPlaceName": "Fayette, Iowa, USA", "transLocation": { "latitude": 42.843281, "longitude": -91.802213}
                    , "antecedentCustodian": finalAntecedentCustodian, "antecedentAuthoriation": "Hbsapdlj093724nb"
                    , "descendentCustodian": finalDescendentCustodian, "descendentAuthoriation": "GHjslu579327GH45"}

    lasttransaction = { "transIdentifier": "aslkfjU89hgHJU890"
                    , "transtype": "Final",   "transClass": "Prescription Drug Purchase"
                    , "transZuluTime": { "year": 2015, "month": 1, "day": 15, "hour": 11, "minutes": 37, "seconds": 41, "msec": 682}
                    , "transPlaceName": "Fayette, Iowa, USA", "transLocation": { "latitude": 42.843281, "longitude": -91.802213}
                    , "antecedentCustodian": finalAntecedentCustodian, "antecedentAuthoriation": "Hbsapdlj093724nb"
                    , "descendentCustodian": None}


    verifyResult = {"resultCode": "verifiedCode"
                 , "resultText": "Valid Serial Code"
                 , "transactions": [firstTransaction, intertransaction, lasttransaction]}

    return verifyResult


def verifyCaptcha(publickey, response, ipaddress):
    """ This function verifies the PharmCat captcha """

    recaptchaSecretKey = "6LcEZQATAAAAAN7iDxjleVtnEtXyFvptf0fG9_Wx"  # Private key must match the Google public key
    recaptchaVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

    verifyParams = {"secret": recaptchaSecretKey, "response": response}

    request = requests.get(recaptchaVerifyURL, params=verifyParams)

    if request.status_code != requests.codes.ok:

        result = {"success": False, "error-codes": "Captcha Communication Error"}

    else:

        logging.info("Request headers %s, text %s", request.headers['content-type'], request.text)
        result = request.json()
        logging.info("Python Request headers %s", json.dumps(result))


    for x in result:
        print (x)

    for keys,values in result.items():
        print(keys)
        print(values)

    return result["success"]


def parseNDCBarCode(barcode):

    return True

def parseSerialCode(serialcode):

    return True

def readNDCRecord(barcode):

    return True

def readSerialCode(serialcode):

    return True


def verifySerialCode(publickey, response, barcode, serialcode, ipaddress):

    verifyResponse = { "success": True, "responseText": "Verify Request Succeeded" }

    if not parseNDCBarCode(barcode):

        verifyResponse.success = False
        verifyResponse.responseText = "Barcode must be 12 or 14 digits, an NDC 10 digits."
        return json.dumps(verifyResponse)

    elif not parseSerialCode(serialcode):

        verifyResponse.success = False
        verifyResponse.responseText = "Serial Code, must be 10 characters or more."
        return json.dumps(verifyResponse)

    elif not verifyCaptcha(publickey, response, ipaddress):

        verifyResponse.success = False
        verifyResponse.responseText = "Unable to verify Captcha."
        return json.dumps(verifyResponse)

    elif not readNDCRecord(barcode):

        verifyResponse.success = False
        verifyResponse.responseText = "Barcode or NDC not found in database."
        return json.dumps(verifyResponse)

    elif not readSerialCode(serialcode):

        verifyResponse.success = False
        verifyResponse.responseText = "Internal Error - Unable to verify serial code."
        return json.dumps(verifyResponse)

    verifyResponse["verifyResult"] = mockVerification()
    verifyString = json.dumps(verifyResponse)

    logging.info("Verify String: %s", verifyString)

    return verifyString

