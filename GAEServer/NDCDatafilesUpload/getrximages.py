#!/usr/bin/python
#
# Copyright: 	Kellerberrin 2014
# Author:	James McCulloch
#

import sys
import os
import os.path

import requests


import CSVrecords  # Local record definitions.
import logfile   # Local logging module.


###########################################################################################################
## Application starts here.
###########################################################################################################


def SetupLogging():
    """Set up Python logging to console and log file"""

    LogFileName = os.getenv("UVISUSDRUGIMAGELOGFILE")
    if LogFileName is None:
        print("Log file environment variable 'UVISUSDRUGIMAGELOGFILE' is undefined")
        sys.exit()    # Terminate with extreme prejudice

    return logfile.setupfilelogging(LogFileName)

# Define a logger for this program
Logger = SetupLogging()


# Read all the records in an FDA RAW package file.


def ReadCSVDataRecords():
    """Reads the CSV file produced by combining the FDA raw files together."""

    CSVFileName = os.getenv("UVISUSDRUGDATAFILE")
    if CSVFileName is None:

        Logger.error("Environment variable 'UVISUSDRUGDATAFILE' must be defined")
        sys.exit()    # Terminate with extreme prejudice

# Open the file and process all records.

    CSVFile = open(CSVFileName, "r")

    if CSVFile.closed:

        Logger.error("Unable to open Data CSV file: %s", CSVFileName)
        sys.exit()    # Terminate with extreme prejudice

# Read all the records.

    RecordArray = CSVFile.readlines()
    CSVFile.close()


    CSVDataList = []

# Remove the header first line
    for Record in RecordArray[1:]:
        CSVDataList.append(CSVrecords.RawCSVClass(Record))

    return CSVDataList


def ReadCSVCheckpointRecords():
    """Reads all the NDC Product.txt records (lines) into an array of strings."""

    CheckpointFileName = os.getenv("UVISUSDRUGIMAGECHECKPOINT")
    if CheckpointFileName is None:

        Logger.error("Environment variable 'UVISUSDRUGIMAGECHECKPOINT' must be defined")
        sys.exit()    # Terminate with extreme prejudice

# Check that the checkpoint file exists, if it does not then return an empty array.

    if not os.path.isfile(CheckpointFileName):
        Logger.info("CSV checkpoint file: %s does not exist - will be recreated", CheckpointFileName)
        return []    # Does not exist so just return an empty array

# Open the file and process all records.
    CheckpointFile = open(CheckpointFileName, "r")

    if CheckpointFile.closed:
        Logger.info("Unable to open CSV checkpoint file: %s", CheckpointFileName)
        sys.exit()    # Terminate with extreme prejudice

# Read all the records.

    RecordArray = CheckpointFile.readlines()
    CheckpointFile.close()

# Remove the header first line

    CSVCheckpointList = []

# No header on the checkpoint file.
    for Record in RecordArray:
        CSVCheckpointList.append(CSVrecords.RawCSVImageClass(Record))

    return CSVCheckpointList


def ProcessCheckpoints(OutFile, CSVCheckpointRecords, CSVDataRecords):
    """Performs Image updates for all image data in the checkpoint file"""

    DataList = []

    CheckpointRecordCount = 0
    if len(CSVCheckpointRecords) > 0:

# Create the checkpoint dictionary

        CheckpointDict = {}

        for CheckpointRecord in CSVCheckpointRecords:
            CheckpointDict.update( { CheckpointRecord.NDC : CheckpointRecord } )

#Process all NDCs already present in the checkpoint dictionary

        for DataRecord in CSVDataRecords:
            Checkpoint = CheckpointDict.get(DataRecord.NDC)
# Check that we found something and write a line if we did.
            if Checkpoint is None:
                DataList.append(DataRecord)
            else:
                DataRecord.MergeImageData(Checkpoint)
                OutFile.write(DataRecord.WriteRawCSV())
                CheckpointRecordCount += 1

    else:
        DataList = CSVDataRecords

    Logger.info("Processed %d Existing Image Records in the Checkpoint File", CheckpointRecordCount)

    return DataList


def processImageAPI(DataList, CSVOutFile):
    """Query the RxImage API of the National Library of Medicine for Solid Drug (Pill) images."""

#   Open the checkpoint file for appending new downloaded data.

    CheckpointFileName = os.getenv("UVISUSDRUGIMAGECHECKPOINT")
    if CheckpointFileName is None:

        Logger.error("Environment variable 'UVISUSDRUGIMAGECHECKPOINT' must be defined")
        sys.exit()    # Terminate with extreme prejudice

# Open the checkpoint file for "append" and process all records.

    CheckpointFile = open(CheckpointFileName, "a")

    if CheckpointFile.closed:
        Logger.error("Unable to open CSV checkpoint file: %s for append", CheckpointFileName)
        sys.exit()    # Terminate with extreme prejudice

# Get the API URLs

    RxImageURL = os.getenv("UVISUSDRUGIMAGEURL")
    if RxImageURL is None:

        Logger.error("Environment variable 'UVISUSDRUGIMAGEURL' must be defined")
        sys.exit()    # Terminate with extreme prejudice

    RxCuiURL = os.getenv("UVISUSDRUGRXCUIURL")
    if RxCuiURL is None:

        Logger.error("Environment variable 'UVISUSDRUGRXCUIURL' must be defined")
        sys.exit()    # Terminate with extreme prejudice

# The record update loop
    RecordCount = 0
# Query all the outstanding records.
    for Record in DataList:
# Get the API data
        CSVImageRecord = getAPIData(Record, RxImageURL, RxCuiURL)
# Update the checkpoint file.
        CheckpointFile.write(CSVImageRecord.WriteRawCSV())
# Update the output file.
        Record.MergeImageData(CSVImageRecord)
        CSVOutFile.write(Record.WriteRawCSV())
# Periodic Stats
        RecordCount += 1
        if RecordCount % 100 == 0:
            Logger.info("API Data Processed Records: %d", RecordCount)

# Finished processing, close the checkpoint file
    CheckpointFile.close()

    return


def getAPIData(Record, RxImageURL, RxCuiURL):

    SmallImageURLObj = getImageData(Record, RxImageURL, 120)
    if SmallImageURLObj["imageURL"] != "":
        LargeImageURLObj = getImageData(Record, RxImageURL, 800)
    else:
        LargeImageURLObj = SmallImageURLObj

    if SmallImageURLObj["ndc9"] != LargeImageURLObj["ndc9"]:
        Logger.error("Different ND9 arrays for small image: %s and large image: %s"
                    , SmallImageURLObj["ndc9"]
                    , LargeImageURLObj["ndc9"])
        Logger.error(Record)

    RxCui = getRxCuiData(Record, RxCuiURL)
    RawCSVImage = CSVrecords.RawCSVImageClass(Record.NDC
                                              , SmallImageURLObj["imageURL"]
                                              , LargeImageURLObj["imageURL"]
                                              , SmallImageURLObj["ndc9"]
                                              , RxCui)

    return RawCSVImage


def getImageData(Record, RxImageURL, resolution):

    requestParams = {"ndc": Record.ELEVEN_DIGIT_NDC, "resolution": str(resolution)}
    request = requests.get(RxImageURL, params=requestParams)

    imageData=request.json()
    imageDataStatus = imageData["replyStatus"]
    imageURLObj = {"imageURL": "", "ndc9": "" }

    if request.status_code == requests.codes.ok:
        if imageDataStatus["success"]:

            if len(imageData["nlmRxImages"]) > 0:
                imageObject = imageData["nlmRxImages"][0]
                imageURLObj["imageURL"] = imageObject["imageUrl"]
                NDC9codes = imageObject.get("relabelersNdc9")
                if not NDC9codes is None:

                    if len(NDC9codes) > 0:
                        NDC9array = NDC9codes[0].get("ndc9")
                        if not NDC9array is None:

                            NDC9count = 0
                            NDC9string = ""  # The NDC9 codes are reformatted as a comma delimited string
                            for NDC9 in NDC9array:
                                if NDC9count:
                                    NDC9string += ","  # No comma before the first NDC9 code
                                # Strip off any dashes and add to comma delimited string
                                NDC9string += NDC9.replace("-", "")
                                NDC9count += 1

                            imageURLObj["ndc9"] = NDC9string

                    if len(NDC9codes) > 1:
                        Logger.warn("getImageData - Image data refers to multiple NDC9 Code Arrays")
                        Logger.warn(imageData["nlmRxImages"])

            if len(imageData["nlmRxImages"]) > 1:
                Logger.info("getImageData - NDC refers to multiple RxImages")
                Logger.info(imageData["nlmRxImages"])

        else:
            Logger.warn("RxImage API call has failure return code")
            Logger.warn(imageDataStatus)
    else:
        Logger.error("getImageData - problem requesting Image Data - status %d", request.status_code )
        Logger.info(imageData["nlmRxImages"])

    return imageURLObj


def getRxCuiData(Record, RxCuiURL):

    requestParams = {"idtype": "NDC", "id": Record.ELEVEN_DIGIT_NDC}
    request = requests.get(RxCuiURL, params=requestParams)

    RxNorm = ""

    if request.status_code == requests.codes.ok:
        RxCuiData=request.json()
        groupData = RxCuiData.get("idGroup")
        if not groupData is None:

            RxCui = groupData.get("rxnormId")
            if not RxCui is None:

                if len(RxCui) > 0:
                    RxNorm = RxCui[0]

                if len(RxCui) > 1:
                    Logger.info("getRxCuiData - NDC refer to multiple RxNorm Identifiers")
                    Logger.info(RxCuiData)

        else:
            Logger.error("getRxCuiData - returned Payload did not contain 'idGroup'")
            Logger.error(RxCuiData)

    else:
        Logger.error("getRxCuiData - problem requesting RxCui Data - status %d", request.status_code )

    return RxNorm


# Mainline Function to process the API updates.

def ProcessImageUpdates():
    """Process the raw Package.txt and Product.txt files into a csv file."""


    CSVDataRecords = ReadCSVDataRecords()
    CSVCheckpointRecords = ReadCSVCheckpointRecords()

    Logger.info("CSVData Record Count: %d", len(CSVDataRecords))
    Logger.info("Checkpoint Record Count: %d", len(CSVCheckpointRecords))

# Open the csv output file.

    CSVOutFileName = os.getenv("UVISUSDRUGIMAGEDATAFILE")
    if CSVOutFileName == None :

        Logger.error("Environment variable 'UVISUSDRUGIMAGEDATAFILE' must be defined")
        sys.exit()    # Terminate with extreme prejudice

# Open the file and process all records.

    CSVOutFile = open(CSVOutFileName, "w")

    if CSVOutFile.closed:
        Logger.error("Unable to open output csv file: %s", CSVOutFileName)
        sys.exit()    # Terminate with extreme prejudice

# Write out the header
    CSVOutFile.write(CSVrecords.RawCSVClass.WriteHeader())

# Update all checkpoint data and write to output file.

    DataList = ProcessCheckpoints(CSVOutFile, CSVCheckpointRecords, CSVDataRecords)

# DataList now contains the list of CSVRecords that must be updated
# by requests on RxImage

    Logger.info("Requesting: %d RxImage API Updates", len(DataList))


    processImageAPI(DataList, CSVOutFile)

# Close the file

    CSVOutFile.close()

    return



# Run the module to process the image updates.

if __name__ == "__main__":
    ProcessImageUpdates()
