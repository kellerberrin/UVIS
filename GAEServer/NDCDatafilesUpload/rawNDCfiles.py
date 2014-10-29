#!/usr/bin/python
#
# Copyright: 	Kellerberrin 2014
# Author:	James McCulloch
#
import os
import sys
from datetime import datetime, date

import logfile  # local logger setup
import CSVrecords  # Local record definitions.


###########################################################################################################
## Application starts here.
###########################################################################################################



def SetupLogging():
    """Set up Python logging to console and log file"""

    LogFileName = os.getenv("UVISUSDRUGRAWDATALOGFILE")
    if LogFileName is None:
        print("Log file environment variable 'UVISUSDRUGRAWDATALOGFILE' is undefined")
        sys.exit()    # Terminate with extreme prejudice

    return logfile.setupfilelogging(LogFileName)

# Define a logger for this program
Logger = SetupLogging()

# Read all the records in an FDA RAW package file.

def ReadAllPackageRecords():
    """Reads all the NDC Package.txt records (lines) into an array of strings."""

    PackageFileName = os.getenv("UVISUSDRUGRAWDATAPACKAGE")
    if PackageFileName == None:

        Logger.error("Environment variable 'UVISUSDRUGRAWDATAPACKAGE' must be defined")
        sys.exit()    # Terminate with extreme prejudice        

# Open the file and process all records.

    PackageFile = open(PackageFileName, "r")

    if PackageFile.closed:

        Logger.error("Unable to open package file: %s", PackageFileName)
        sys.exit()    # Terminate with extreme prejudice        

# Read all the records.     

    RecordArray = PackageFile.readlines()
    PackageFile.close()

# Remove the header first line 

    return RecordArray[1:]


def ReadAllProductRecords():
    """Reads all the NDC Product.txt records (lines) into an array of strings."""

    ProductFileName = os.getenv("UVISUSDRUGRAWDATAPRODUCT")
    if ProductFileName == None:

        Logger.error("Environment variable 'UVISUSDRUGRAWDATAPRODUCT' must be defined")
        sys.exit()    # Terminate with extreme prejudice        

# Open the file and process all records.

    ProductFile = open(ProductFileName, "r")

    if ProductFile.closed:
        Logger.error("Unable to open product file: %s", ProductFileName)
        sys.exit()    # Terminate with extreme prejudice        

# Read all the records.     

    RecordArray = ProductFile.readlines()
    ProductFile.close()

# Remove the header first line 

    return RecordArray[1:]

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

    if EndDate > Today:
        return True
    else:
        return False 

# Function to write a csv line. 


def WriteCSVLine(CSVFile, Product, Package):

# Check if still marketed and is a prescription drug.

    RecordWrite = False

    if ValidDrugRecord(Product):

        RecordWrite = True

        RawCSVRecord = CSVrecords.RawCSVClass(Product, Package)

        CSVFile.write(RawCSVRecord.WriteRawCSV())

    return RecordWrite

# Function to process both files.


def ProcessRawNDCFiles() :
    """Process the raw Package.txt and Product.txt files into a csv file."""

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

    if CSVFile.closed:
        Logger.error("Unable to open output csv file: %s", CSVFileName)
        sys.exit()    # Terminate with extreme prejudice        

# Create the product dictionary

    for Record in ProductRecords:
        Product = CSVrecords.ProductClass(Record)
        ProductDict.update( { Product.PRODUCTNDC : Product } )

#Create the package list

    for Record in PackageRecords:
        PackageList.append(CSVrecords.PackageClass(Record))

# For each package look up a product.

    CSVFile.write(CSVrecords.RawCSVClass.WriteHeader())

    RecordCount = 0
    for Package in PackageList:
        Product = ProductDict.get(Package.PRODUCTNDC)
# Check that we found something and write a line.
        if Product == None :
            Logger.error("Package NDC: %s , Could not find Product Code: %s", Package.NDCPACKAGECODE, Package.PRODUCTNDC)
        else:
            if WriteCSVLine(CSVFile, Product, Package):
                RecordCount += 1



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
    ProcessRawNDCFiles()
 
