__author__ = "kellerberrin"

package = "USDrugLibrary"


import sys
import os
import logging

""" Setup the libs directory for the 'requests' package """

sys.path.append(os.path.join(os.path.dirname(__file__), 'libs'))

import requests

"""Consume and cache the National Library of Medicine Solid Drug (Pill) images."""


def requestCacheImages(ndc, resolution):

    requestParams = {"ndc": ndc, "resolution": str(resolution)}
    request = requests.get("http://rximage.nlm.nih.gov/api/rximage/1/rxbase", params=requestParams)

    imageData=request.json()
    imageDataStatus = imageData["replyStatus"]
    imageURL = ""

    if request.status_code == requests.codes.ok:
        if imageDataStatus["success"]:
            if len(imageData["nlmRxImages"]) > 0:
                imageObject = imageData["nlmRxImages"][0]
                imageURL = imageObject["imageUrl"]
        else:
            logging.info(imageDataStatus)

    return imageURL


def getImageURLs(ndc):

    ImageURL = ["", ""]

    ImageURL[0] = requestCacheImages(ndc, 120)
    if ImageURL[0] != "":
        ImageURL[1] = requestCacheImages(ndc, 800)

    return ImageURL