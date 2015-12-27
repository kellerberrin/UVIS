#!/usr/bin/python
#
# Copyright: 	Kellerberrin 2015
# Author:	James McCulloch
#
# This Python script uploads 

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

    LogFileName = os.getenv("UVISUSDRUGSQLLOGFILE")
    if LogFileName is None:
        print("Log file environment variable 'UVISUSDRUGSQLLOGFILE' is undefined")
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


# Remove and report any NDC duplicates 
def RemoveNDCDuplicates(CSVDataRecords):

    NoDuplicatesList = []

# Create the record dictionary

    DataRecordDict = {}

#Check if an NDC is present in the Dictionary

    for DataRecord in CSVDataRecords:

        FoundRecord = DataRecordDict.get(DataRecord.NDC)

# Check that we found something and issue a warning if we did

        if FoundRecord is None:

            DataRecordDict.update( { DataRecord.NDC : DataRecord } )
            NoDuplicatesList.append(DataRecord)

        else:

# Issue a warning

            Logger.warning("Duplicate NDC Found for: %s", DataRecord.NDC)

    return NoDuplicatesList


# Mainline Function to process the API updates.
def CreateFDADrugTable(DataRecords, SQLOutFile):
    """Drops and then recreates the FDADrug table and populates it with data"""

    DataRecords = RemoveNDCDuplicates(DataRecords)

# Write out the drop table, header and the insert records header.

    SQLOutFile.write(CSVrecords.SQL_FDADrugClass.DropSQLTable())
    SQLOutFile.write("\n\n\n") # Insert some white space
    SQLOutFile.write(CSVrecords.SQL_FDADrugClass.WriteSQLTableHeader())

# Write all the CSV records to the SQL output file
    
    RecordCount = 0
    InsertSize = 1000 # Number of records for each insert transaction

    for CSVRecord in DataRecords[:]:

        if (RecordCount % InsertSize) == 0:

            if RecordCount > 0: # Terminate the previous insert statement
                SQLOutFile.write(";\n")
                 
            SQLOutFile.write("\n\n\n") # Insert some white space
            SQLOutFile.write(CSVrecords.SQL_FDADrugClass.WriteSQLInsertHeader())

        else:

            SQLOutFile.write(",\n")

        RecordCount = RecordCount + 1

        SQLOutFile.write(CSVRecord.WriteSQLLine())

# Write the final semicolon for the last insert statemment.

    SQLOutFile.write(";\n")

    return


# Remove and report any Name duplicates 
def RemoveNameDuplicates(CSVDataRecords):

    NoDuplicatesList = []

# Create the record dictionary

    DataRecordDict = {}

#Check if an NDC is present in the Dictionary

    for DataRecord in CSVDataRecords:

        FoundRecord = DataRecordDict.get(DataRecord.PROPRIETARYNAME)

# Check that we found something and issue a warning if we did

        if FoundRecord is None:

            DataRecordDict.update( { DataRecord.PROPRIETARYNAME : DataRecord } )
            NoDuplicatesList.append(DataRecord)


    return NoDuplicatesList

# Mainline Function to process the API updates.
def CreateTypeAheadTable(DataRecords, SQLOutFile):
    """Drops and then recreates the typeahead tables and populates them with data"""

    DataRecords = RemoveNameDuplicates(DataRecords)





    return

# Mainline Function to process the API updates.
def ProcessSQLFile():
    """Read the records in CSV format and create an SQL dump file that can be uploaded into an SQL database"""

    CSVDataRecords = ReadCSVDataRecords()

    Logger.info("CSVData Record Count: %d", len(CSVDataRecords))

# Open the SQL dump file.

    SQLOutFileName = os.getenv("UVISUSDRUGSQLUPLOAD")
    if SQLOutFileName == None :

        Logger.error("Environment variable 'UVISUSDRUGSQLUPLOAD' must be defined")
        sys.exit()    # Terminate with extreme prejudice

# Open the file and process all records.

    SQLOutFile = open(SQLOutFileName, "w")

    if SQLOutFile.closed:
        Logger.error("Unable to open output SQL file: %s", SQLOutFileName)
        sys.exit()    # Terminate with extreme prejudice

# Write out the FDADrug table SQL source file.

    CreateFDADrugTable(CSVDataRecords, SQLOutFile)
    CreateTypeAheadTable(CSVDataRecords, SQLOutFile)

# Close the file

    SQLOutFile.close()

    return



# Run the module to process the image updates.

if __name__ == "__main__":
    ProcessSQLFile()
