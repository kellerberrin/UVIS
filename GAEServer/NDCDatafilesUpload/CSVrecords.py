#!/usr/bin/python
#
# Copyright: 	Kellerberrin 2014
# Author:	James McCulloch
#

import StringIO
import csv
import logging
import sys

import logfile  # local logger setup
Logger = logfile.getAppLogger()   # assume that a logger is defined in the calling module


class PackageClass:

    def __init__(self, TabbedString):

        StringArray = TabbedString.split("\t")
#    Check that we have the correct number of fields (4).    
        if len(StringArray) != 4 :
            Logger.error("Package file record: %s, bad field count: %d", TabbedString, len(StringArray))
            sys.exit()    # Terminate with extreme prejudice        

        self.PRODUCTID = StringArray[0].strip()		
        self.PRODUCTNDC = StringArray[1].strip()		
        self.NDCPACKAGECODE = StringArray[2].strip()		
        self.PACKAGEDESCRIPTION = StringArray[3].strip()	


class ProductClass:

    def __init__(self, TabbedString):

        StringArray = TabbedString.split("\t")
#    Check that we have the correct number of fields (18).    
        if len(StringArray) != 18:
            Logger.error("Product file record: %s, bad field count: %d", TabbedString, len(StringArray))
            sys.exit()    # Terminate with extreme prejudice        

        self.PRODUCTID = StringArray[0].strip()	
        self.PRODUCTNDC = StringArray[1].strip()		
        self.PRODUCTTYPENAME = StringArray[2].strip()		
        self.PROPRIETARYNAME = StringArray[3].strip()		
        self.PROPRIETARYNAMESUFFIX = StringArray[4].strip()		
        self.NONPROPRIETARYNAME = StringArray[5].strip()		
        self.DOSAGEFORMNAME = StringArray[6].strip()		
        self.ROUTENAME = StringArray[7].strip()		
        self.STARTMARKETINGDATE = StringArray[8].strip()		
        self.ENDMARKETINGDATE = StringArray[9].strip()		
        self.MARKETINGCATEGORYNAME = StringArray[10].strip()		
        self.APPLICATIONNUMBER = StringArray[11].strip()		
        self.LABELERNAME = StringArray[12].strip()		
        self.SUBSTANCENAME = StringArray[13].strip()		
        self.ACTIVE_NUMERATOR_STRENGTH = StringArray[14].strip()		
        self.ACTIVE_INGRED_UNIT = StringArray[15].strip()		
        self.PHARM_CLASSES = StringArray[16].strip()		
        self.DEASCHEDULE = StringArray[17].strip()	


############################################################################################
## The Raw CSV Record Format uploaded into the GAE Datastore
############################################################################################


class RawCSVClass:

    def __init__(self, *args, **kwargs ):

        if len(args) == 1:
            self.InitLineRecord(args[0])
            return

        if len(args) == 2:
            self.InitFDA(args[0], args[1])
            return

        Logger.error("RawCSVClass Constructor - bad argument count: %d", len(args))
        sys.exit()    # Terminate with extreme prejudice

    def InitFDA(self, Product, Package):

        self.NDC = Package.NDCPACKAGECODE.replace('-', '')
        self.FORMAT = NDCFormat(Package.NDCPACKAGECODE)
        self.PRODUCTTYPENAME = Product.PRODUCTTYPENAME
        self.PROPRIETARYNAME = Product.PROPRIETARYNAME
        self.NONPROPRIETARYNAME = Product.NONPROPRIETARYNAME
        self.DOSAGEFORMNAME = Product.DOSAGEFORMNAME
        self.ROUTENAME = Product.ROUTENAME
        self.APPLICATIONNUMBER = Product.APPLICATIONNUMBER
        self.LABELERNAME = Product.LABELERNAME
        self.SUBSTANCENAME = Product.SUBSTANCENAME
        self.ACTIVE_NUMERATOR_STRENGTH = Product.ACTIVE_NUMERATOR_STRENGTH
        self.ACTIVE_INGRED_UNIT = Product.ACTIVE_INGRED_UNIT
        self.PHARM_CLASSES = Product.PHARM_CLASSES
        self.PACKAGEDESCRIPTION = Package.PACKAGEDESCRIPTION
        self.NINE_DIGIT_NDC = NDCNineDigit(Package.NDCPACKAGECODE)
        self.SMALL_IMAGE_URL = ""
        self.LARGE_IMAGE_URL = ""
        self.NDCNINE_IMAGECODES = ""
        self.ELEVEN_DIGIT_NDC = NDCElevenDigit(Package.NDCPACKAGECODE)
        self.RXCUI = ""

    def InitLineRecord(self, LineRecord):

        StringArray = ParseCSVString(LineRecord)

        if len(StringArray) != 20:
            Logger.error("RawCSVClass record: %s, bad field count: %d", StringArray, len(StringArray))
            sys.exit()    # Terminate with extreme prejudice

        self.NDC = StringArray[0]
        self.FORMAT = StringArray[1]
        self.PRODUCTTYPENAME = StringArray[2]
        self.PROPRIETARYNAME = StringArray[3]
        self.NONPROPRIETARYNAME = StringArray[4]
        self.DOSAGEFORMNAME = StringArray[5]
        self.ROUTENAME = StringArray[6]
        self.APPLICATIONNUMBER = StringArray[7]
        self.LABELERNAME = StringArray[8]
        self.SUBSTANCENAME = StringArray[9]
        self.ACTIVE_NUMERATOR_STRENGTH = StringArray[10]
        self.ACTIVE_INGRED_UNIT = StringArray[11]
        self.PHARM_CLASSES = StringArray[12]
        self.PACKAGEDESCRIPTION = StringArray[13]
        self.NINE_DIGIT_NDC = StringArray[14]
        self.SMALL_IMAGE_URL = StringArray[15]
        self.LARGE_IMAGE_URL = StringArray[16]
        self.NDCNINE_IMAGECODES = StringArray[17]
        self.ELEVEN_DIGIT_NDC = StringArray[18]
        self.RXCUI = StringArray[19]

    def MergeImageData(self, CheckpointImageData):

# Check that the NDCs match
        if CheckpointImageData.NDC != self.NDC:
            Logger.error("RawCSVClass.MergeImage(), Image NDC %s different from RawCSVlass NDC: %s"
                         , CheckpointImageData.NDC
                         , self.NDC)
            return False

        self.SMALL_IMAGE_URL = CheckpointImageData.SMALL_IMAGE_URL
        self.LARGE_IMAGE_URL = CheckpointImageData.LARGE_IMAGE_URL
        self.NDCNINE_IMAGECODES = CheckpointImageData.NDCNINE_IMAGECODES
        self.RXCUI = CheckpointImageData.RXCUI

        return True

    def WriteRawCSV(self):

        RecordString = '"' + self.NDC + '"' + ',' \
                    + '"' + self.FORMAT + '"' + ','  \
                    + '"' + self.PRODUCTTYPENAME + '"' + ',' \
                    + '"' + self.PROPRIETARYNAME + '"' + ',' \
                    + '"' + self.NONPROPRIETARYNAME + '"' + ',' \
                    + '"' + self.DOSAGEFORMNAME + '"' + ',' \
                    + '"' + self.ROUTENAME + '"' + ',' \
                    + '"' + self.APPLICATIONNUMBER + '"' + ',' \
                    + '"' + self.LABELERNAME + '"' + ',' \
                    + '"' + self.SUBSTANCENAME + '"' + ',' \
                    + '"' + self.ACTIVE_NUMERATOR_STRENGTH + '"' + ',' \
                    + '"' + self.ACTIVE_INGRED_UNIT + '"' + ',' \
                    + '"' + self.PHARM_CLASSES + '"' + ',' \
                    + '"' + self.PACKAGEDESCRIPTION + '"' + ',' \
                    + '"' + self.NINE_DIGIT_NDC + '"' + ',' \
                    + '"' + self.SMALL_IMAGE_URL + '"' + ',' \
                    + '"' + self.LARGE_IMAGE_URL + '"' + ',' \
                    + '"' + self.NDCNINE_IMAGECODES + '"' + ',' \
                    + '"' + self.ELEVEN_DIGIT_NDC + '"' + ',' \
                    + '"' + self.RXCUI + '"' + '\n'

        return RecordString

    @staticmethod
    def WriteHeader():

        HeaderString = '"' + 'NDC' + '"' + ',' \
                    + '"' + 'FORMAT' + '"' + ','  \
                    + '"' + 'PRODUCTTYPENAME' + '"' + ',' \
                    + '"' + 'PROPRIETARYNAME' + '"' + ',' \
                    + '"' + 'NONPROPRIETARYNAME' + '"' + ',' \
                    + '"' + 'DOSAGEFORMNAME' + '"' + ',' \
                    + '"' + 'ROUTENAME' + '"' + ',' \
                    + '"' + 'APPLICATIONNUMBER' + '"' + ',' \
                    + '"' + 'LABELERNAME' + '"' + ',' \
                    + '"' + 'SUBSTANCENAME' + '"' + ',' \
                    + '"' + 'ACTIVE_NUMERATOR_STRENGTH' + '"' + ',' \
                    + '"' + 'ACTIVE_INGRED_UNIT' + '"' + ',' \
                    + '"' + 'PHARM_CLASSES' + '"' + ',' \
                    + '"' + 'PACKAGEDESCRIPTION' + '"' + ',' \
                    + '"' + 'NINE_DIGIT_NDC' + '"' + ',' \
                    + '"' + 'SMALL_IMAGE_URL' + '"' + ',' \
                    + '"' + 'LARGE_IMAGE_URL' + '"' + ',' \
                    + '"' + 'NDCNINE_IMAGECODES' + '"' + ',' \
                    + '"' + 'ELEVEN_DIGIT_NDC' + '"' + ',' \
                    + '"' + 'RXCUI' + '"' + '\n'

        return HeaderString


############################################################################################
## The Image CSV Record Format
############################################################################################

class RawCSVImageClass:

    def __init__(self,*args, **kwargs ):

        if len(args) == 5:
            self.InitDiscrete(args[0], args[1], args[2], args[3], args[4])
            return

        if len(args) == 1:
            self.InitLineRecord(args[0])
            return

        Logger.error("RawCSVImageClass Constructor - bad argument count: %d", len(args))
        sys.exit()    # Terminate with extreme prejudice

    def InitDiscrete(self, NDC, SMALL_IMAGE_URL, LARGE_IMAGE_URL, NDCNINE_IMAGECODES, RXCUI):

        self.NDC = NDC
        self.SMALL_IMAGE_URL = SMALL_IMAGE_URL
        self.LARGE_IMAGE_URL = LARGE_IMAGE_URL
        self.NDCNINE_IMAGECODES = NDCNINE_IMAGECODES
        self.RXCUI = RXCUI

    def InitLineRecord(self, LineRecord):

        StringArray = ParseCSVString(LineRecord)

        if len(StringArray) != 5:
            Logger.error("RawCSVImageClass record: %s, bad field count: %d", StringArray, len(StringArray))
            sys.exit()    # Terminate with extreme prejudice

        self.NDC = StringArray[0]
        self.SMALL_IMAGE_URL = StringArray[1]
        self.LARGE_IMAGE_URL = StringArray[2]
        self.NDCNINE_IMAGECODES = StringArray[3]
        self.RXCUI = StringArray[4]

    def WriteRawCSV(self):

        RecordString = '"' + self.NDC + '"' + ',' \
                    + '"' + self.SMALL_IMAGE_URL + '"' + ','  \
                    + '"' + self.LARGE_IMAGE_URL + '"' + ',' \
                    + '"' + self.NDCNINE_IMAGECODES + '"' + ',' \
                    + '"' + self.RXCUI + '"' + '\n'

        return RecordString


############################################################################################
## Utility functions.
############################################################################################

def ParseCSVString(CSVString):

#    Convert the input string to a file handle
        f = StringIO.StringIO(CSVString)
#    Now use the csv module to parse the 'file'
        csv_iter = csv.reader(f, delimiter=',')

# Should only have 1 record.
        RecordCount = 0
        for CSVRecord in csv_iter:
            RecordCount += 1
            StringArray = CSVRecord

# Check that we only processed one record.
        if RecordCount != 1:
            Logger.error("CSV parsing string: %s, expected to parse 1 record, parse %d records ", CSVString, RecordCount)
            sys.exit()    # Terminate with extreme prejudice

        return StringArray


def NDCFormat(NDCCode) :
# Find the first dash
    First = NDCCode.find("-")
# Find the last dash
    Last = NDCCode.rfind("-")
# Adjust the index counts
    LastIndex = Last-First-1
    PackIndex = 10 - First - LastIndex

    Format = str(First) + "-" + str(LastIndex) + "-" + str(PackIndex)
    return Format


def NDCNineDigitFormat(NDC, Format) :
    """Utility function generates an 9-digit formatted National Drug Code"""
    CleanNDC = NDC.replace("-", "")

    if len(CleanNDC) != 10:
        Logger.error("Unable to determine 9 Digit NDC for %s - '000000000' returned", NDC)
        return "000000000"

    LabellerSize = int(Format[0])
    ProductSize = int(Format[2])

    LabellerCode = CleanNDC[:LabellerSize]
    ProductCode = CleanNDC[LabellerSize:(LabellerSize + ProductSize)]
    PackageCode = CleanNDC[(LabellerSize + ProductSize):]

    if Format == "4-4-2":
        LabellerCode = "0" + LabellerCode
    elif Format == "5-3-2":
        ProductCode = "0" + ProductCode
    elif Format == "5-4-1":
        PackageCode = "0" + PackageCode
    else:
        Logger.error("Unable to determine 9 Digit NDC for %s - '000000000' returned", NDC)
        return "000000000"

    FormatNDC = LabellerCode + ProductCode
    return FormatNDC


def NDCNineDigit(NDC):
    return NDCNineDigitFormat(NDC, NDCFormat(NDC))


def NDCElevenDigitFormat(NDC, Format) :
    """Utility function generates an 11-digit formatted National Drug Code"""
    CleanNDC = NDC.replace("-", "")

    if len(CleanNDC) != 10:
        Logger.error("Unable to determine 11 Digit NDC for %s - '000000000' returned", NDC)
        return "000000000"

    LabellerSize = int(Format[0])
    ProductSize = int(Format[2])

    LabellerCode = CleanNDC[:LabellerSize]
    ProductCode = CleanNDC[LabellerSize:(LabellerSize + ProductSize)]
    PackageCode = CleanNDC[(LabellerSize + ProductSize):]

    if Format == "4-4-2" :
        LabellerCode = "0" + LabellerCode
    elif Format == "5-3-2" :
        ProductCode = "0" + ProductCode
    elif Format == "5-4-1" :
        PackageCode = "0" + PackageCode
    else:
        Logger.error("Unable to determine 11 Digit NDC for %s - '000000000' returned", NDC)
        return "000000000"

    FormatNDC = LabellerCode + ProductCode + PackageCode
    return FormatNDC


def NDCElevenDigit(NDC):
    return NDCElevenDigitFormat(NDC, NDCFormat(NDC))

