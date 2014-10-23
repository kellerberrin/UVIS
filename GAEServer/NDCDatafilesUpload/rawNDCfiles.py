#!/usr/bin/python
#
# Copyright: 	Kellerberrin
# Author:	James McCulloch
#
import os
import sys
import logging
from datetime import datetime, date

# Place holder for the NLM image file URLS.



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
        if len(StringArray) != 18 :
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
        

global Logger


def SetupLogging() :
    "Set up Python logging to console and log file" 

    global Logger

    Logger = logging.getLogger(__name__)
    Logger.setLevel(logging.INFO)

# Create a console log

    ConsoleLog = logging.StreamHandler()
    ConsoleLog.setLevel(logging.DEBUG)

# Create a logging format and add to the logging streams

    LogFormat = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ConsoleLog.setFormatter(LogFormat)

# Add the console log stream to the logger

    Logger.addHandler(ConsoleLog)

# Create a file handler

    LogFileName = os.getenv("UVISUSDRUGRAWDATALOGFILE")
    if LogFileName == None :
        Logger.error("Log file environment variable 'UVISUSDRUGRAWDATALOGFILE' is undefined")
        return

    FileLog = logging.FileHandler(LogFileName)
    FileLog.setLevel(logging.DEBUG)
    FileLog.setFormatter(LogFormat)

    Logger.addHandler(FileLog)

    return

# Read all the records in an FDA RAW package file.


def ReadAllPackageRecords() :
    "Reads all the NDC Package.txt records (lines) into an array of strings."

    RecordArray = []

    PackageFileName = os.getenv("UVISUSDRUGRAWDATAPACKAGE")
    if PackageFileName == None :

        Logger.error("Environment variable 'UVISUSDRUGRAWDATAPACKAGE' must be defined")
        sys.exit()    # Terminate with extreme prejudice        

# Open the file and process all records.

    PackageFile = open(PackageFileName, "r")

    if PackageFile.closed :

        Logger.error("Unable to open package file: %s", PackageFileName)
        sys.exit()    # Terminate with extreme prejudice        

# Read all the records.     

    RecordArray = PackageFile.readlines()
    PackageFile.close()

# Remove the header first line 

    return RecordArray[1:]


def ReadAllProductRecords() :
    "Reads all the NDC Product.txt records (lines) into an array of strings."

    RecordArray = []

    ProductFileName = os.getenv("UVISUSDRUGRAWDATAPRODUCT")
    if ProductFileName == None :

        Logger.error("Environment variable 'UVISUSDRUGRAWDATAPRODUCT' must be defined")
        sys.exit()    # Terminate with extreme prejudice        

# Open the file and process all records.

    ProductFile = open(ProductFileName, "r")

    if ProductFile.closed :
        Logger.error("Unable to open product file: %s", ProductFileName)
        sys.exit()    # Terminate with extreme prejudice        

# Read all the records.     

    RecordArray = ProductFile.readlines()
    ProductFile.close()

# Remove the header first line 

    return RecordArray[1:]

# Convenience function to return a format string from a dash "-" separated NDC


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

    if Format == "4-4-2" :
        LabellerCode = "0" + LabellerCode
    elif Format == "5-3-2" :
        ProductCode = "0" + ProductCode
    elif Format == "5-4-1" :
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


# Function to write the csv header

def WriteHeader(CSVFile) :

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

    CSVFile.write(HeaderString) 

# Check if still marketed and is a prescription drug.


def ValidDrugRecord(Product) :

    if Product.PRODUCTTYPENAME != "HUMAN PRESCRIPTION DRUG" :
        return False

    if len(Product.ENDMARKETINGDATE) == 0 :
        return True 

    if len(Product.ENDMARKETINGDATE) != 8 :
        Logger.error("Bad Date Format ENDMARKETINGDATE %s", Product.ENDMARKETINGDATE)
        return False
         
    Today = date.today()
    Year = int(Product.ENDMARKETINGDATE[0:4])
    Month = int(Product.ENDMARKETINGDATE[4:6])
    Day = int(Product.ENDMARKETINGDATE[6:8])

#    Logger.info("ENDMARKETINGDATE:%s, Year %d, Month %d, Day %d", Product.ENDMARKETINGDATE, Year, Month, Day)

    EndDate = date(Year, Month, Day)

#    Logger.info("ENDMARKETINGDATE %s, Calculated Date %s", Product.ENDMARKETINGDATE, EndDate.isoformat())

    if EndDate > Today :
        return True
    else :
        return False 

# Function to write a csv line. 


def WriteCSVLine(CSVFile, Product, Package):

# Check if still marketed and is a prescription drug.
    if ValidDrugRecord(Product):
    
        LineString = '"' + Package.NDCPACKAGECODE.replace('-','') + '"' + ',' \
                    + '"' + NDCFormat(Package.NDCPACKAGECODE) + '"' + ',' \
                    + '"' + Product.PRODUCTTYPENAME + '"' + ',' \
                    + '"' + Product.PROPRIETARYNAME + '"' + ',' \
                    + '"' + Product.NONPROPRIETARYNAME + '"' + ',' \
                    + '"' + Product.DOSAGEFORMNAME + '"' + ',' \
                    + '"' + Product.ROUTENAME + '"' + ',' \
                    + '"' + Product.APPLICATIONNUMBER + '"' + ',' \
                    + '"' + Product.LABELERNAME + '"' + ',' \
                    + '"' + Product.SUBSTANCENAME + '"' + ',' \
                    + '"' + Product.ACTIVE_NUMERATOR_STRENGTH + '"' + ',' \
                    + '"' + Product.ACTIVE_INGRED_UNIT + '"' + ',' \
                    + '"' + Product.PHARM_CLASSES + '"' + ',' \
                    + '"' + Package.PACKAGEDESCRIPTION + '"' + ',' \
                    + '"' + NDCNineDigit(Package.NDCPACKAGECODE) + '"' + ',' \
                    + '"' + "" + '"' + ',' \
                    + '"' + "" + '"' + ',' \
                    + '"' + "" + '"' + ',' \
                    + '"' + NDCElevenDigit(Package.NDCPACKAGECODE) + '"' + ',' \
                    + '"' + "" + '"' + '\n'

        CSVFile.write(LineString) 

# Function to process both files.


def ProcessRawNDCFiles() :
    "Process the raw Package.txt and Product.txt files into a csv file."

    ProductDict = {}
    PackageList = []

    PackageRecords = ReadAllPackageRecords()
    ProductRecords = ReadAllProductRecords()

# Open the csv output file.

    CSVFileName = os.getenv("UVISUSDRUGDATAFILE")
    if CSVFileName == None :

        Logger.error("Environment variable 'UVISUSDRUGDATAFILE' must be defined")
        sys.exit()    # Terminate with extreme prejudice        

# Open the file and process all records.

    CSVFile = open(CSVFileName, "w")

    if CSVFile.closed :
        Logger.error("Unable to open output csv file: %s", CSVFileName)
        sys.exit()    # Terminate with extreme prejudice        

# Create the product dictionary

    for Record in ProductRecords :
        Product = ProductClass(Record)
        ProductDict.update( { Product.PRODUCTNDC : Product } )

#Create the package list

    for Record in PackageRecords :
        PackageList.append(PackageClass(Record)) 

# For each package look up a product.

    WriteHeader(CSVFile)

    RecordCount = 0
    for Package in PackageList :
        Product = ProductDict.get(Package.PRODUCTNDC)
# Check that we found something and write a line.
        if Product == None :
            Logger.error("Package NDC: %s , Could not find Product Code: %s", Package.NDCPACKAGECODE, Package.PRODUCTNDC)
        else:
            RecordCount += 1
            WriteCSVLine(CSVFile, Product, Package)

# Close the file

    CSVFile.close()    

# Write some stats.
                 
    Logger.info("Package Record Count: %d", len(PackageRecords))
    Logger.info("Product Record Count: %d", len(ProductRecords))
    Logger.info("Package Class Count: %d", len(PackageList))
    Logger.info("Product Dictionary Count: %d", len(ProductDict))
    Logger.info("CSV Record Count: %d", RecordCount)


# Run the module to process both files.

if __name__ == "__main__":
    SetupLogging()
    ProcessRawNDCFiles()
 
