#!/usr/bin/python
#
# Copyright: 	Kellerberrin
# Author:	James McCulloch
#
from datetime import datetime, date


#convert a single date string to date
def toDate(datestring):
    #Unsupported type datetime.date
    #return datetime.strptime(datestring,fmt).date()
    return datetime.strptime(datestring,fmt)
   
#convert a list of date strings to list of date
def toDateList(format,delimiter):
    global fmt
    fmt = format
    def to_date_list(value):       
        return map(toDate,value.split(delimiter))
    return to_date_list
   
#convert a single date to string
def dateToString(dt):
    return dt.strftime(fmt)

#convert list of dates to a single string
def dateListToString(format,delimiter):
    global fmt
    fmt = format
    def date_list_to_string(value):
        dateStringList = map(dateToString,value)
        return delimiter.join(dateStringList)
    return date_list_to_string

#Convert to a clean list of semi-colon delimited strings.

def SemiDelimiter() :
    def semiDelimiter(String) :
        StringList = String.split(";")
        CleanList = []
        for String in StringList :
            if len(String) >= 0 : CleanList.append(String.strip())
        return CleanList
    return semiDelimiter

#Convert to a clean list of comma delimited strings.

def CommaDelimiter() :
    def commaDelimiter(String) :
        StringList = String.split(",")
        CleanList = []
        for String in StringList :
            if len(String) >= 0 : CleanList.append(String.strip())
        return CleanList
    return commaDelimiter

#Convert to a clean list of space  delimited strings, remove commas

def SpaceDelimiter() :
    def spaceDelimiter(String) :
        StringList = String.split(" ")
        CleanList = []
        for String in StringList :
            String.replace(";","")
            if len(String) >= 0 : CleanList.append(String.strip())
        return CleanList
    return spaceDelimiter
