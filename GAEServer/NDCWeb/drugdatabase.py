import os
import logging


from google.appengine.api import users
from google.appengine.ext import ndb


class NDCLookup(ndb.Model):
    """Models an individual NDC entry."""
    ndc = ndb.StringProperty()
    format = ndb.StringProperty()
    producttypename = ndb.StringProperty()
    proprietaryname = ndb.StringProperty()
    nonproprietaryname = ndb.StringProperty()
    dosageformname = ndb.StringProperty()
    routename = ndb.StringProperty()
    applicationnumber = ndb.StringProperty()
    labellername = ndb.StringProperty()
    substancename = ndb.StringProperty()
    activenumeratorstrength = ndb.StringProperty()
    activeingredientunit = ndb.StringProperty()
    pharmclasses = ndb.StringProperty()
    packagedescription = ndb.StringProperty()		

    
class EnhancedNDCLookup :   
    pass
        
        
NDCSEARCHEXAMPLE = "Enter a 10 Digit NDC, Example: '0002477090' or '0002-4770-90'."
GENERICSEARCHEXAMPLE = "Enter a Drug Name, Example 'Livalo' (case insensitive)."
ACTIVESEARCHEXAMPLE = "Enter an Active Ingredient, Example 'Pitavastatin' (case insensitive)."	


def NDCTenDigitFormat(NDC, Format) :
    "Utility function generates a 10-digit formatted National Drug Code"
    CleanNDC = NDC.replace("-", "")

    if len(CleanNDC) != 10 :
        return "0000-0000-00"

    LabellerSize = int(Format[0])
    ProductSize = int(Format[2])

    LabellerCode = CleanNDC[:LabellerSize]
    ProductCode = CleanNDC[LabellerSize:(LabellerSize + ProductSize)]
    PackageCode = CleanNDC[(LabellerSize + ProductSize):]
    
    FormatNDC = LabellerCode + "-" + ProductCode + "-" + PackageCode

    return FormatNDC

    
def NDCElevenDigitFormat(NDC, Format) :
    "Utility function generates an 11-digit formatted National Drug Code"
    CleanNDC = NDC.replace("-", "")

    if len(CleanNDC) != 10 :
        return "00000-0000-00"                
        
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
    else :
        return "00000-0000-00"                
        
    FormatNDC = LabellerCode + "-" + ProductCode + "-" + PackageCode

    return FormatNDC

    
def ReadNDCDatabase(SearchText, SearchType):
    " Read the NDC database from the Google App Engine Kind NDCLookup"

    GenericSelected = ""
    ActiveSelected = ""
    NDCRecords = []
    NDCElevenDigits = ""
    NDCEnhancedArray = []
    
    if SearchType=="ndc":

        SearchExampleText = NDCSEARCHEXAMPLE
        SearchError = not(SearchText.isdigit()) or len(SearchText) != 10  
        qNDC = NDCLookup.query(NDCLookup.ndc == SearchText)

    elif SearchType=="generic":
        SearchExampleText = GENERICSEARCHEXAMPLE
        GenericSelected = "selected"
        SearchError = len(SearchText) == 0              
        qNDC = NDCLookup.query(NDCLookup.proprietaryname == SearchText)

    else:
        SearchExampleText = ACTIVESEARCHEXAMPLE
        ActiveSelected = "selected"
        SearchError = len(SearchText) == 0              
        qNDC = NDCLookup.query(NDCLookup.substancename == SearchText)
 
 
    if not(SearchError) : NDCRecords = qNDC.fetch(limit=100)

    for NDCRecord in NDCRecords :
        NDCRecord.ndc = NDCTenDigitFormat(NDCRecord.ndc, NDCRecord.format)
        NDCRecord.proprietaryname = NDCRecord.proprietaryname.title()
        NDCRecord.nonproprietaryname = NDCRecord.nonproprietaryname.title()
        NDCElevenDigits = NDCElevenDigitFormat(NDCRecord.ndc, NDCRecord.format)
        NDCEnhanced = EnhancedNDCLookup()
        NDCEnhanced.NDCRecord = NDCRecord
        NDCEnhanced.NDCElevenDigits = NDCElevenDigits
        NDCEnhancedArray.append(NDCEnhanced)
            
                   
    JINJATemplatValues = { 'NDCEnhancedArray' : NDCEnhancedArray,
                           'TypeExample' : SearchExampleText, 
                           'SearchText' : SearchText, 
                           'SearchType' : SearchType,
                           'GenericSelected' : GenericSelected,
                           'ActiveSelected' : ActiveSelected }

    return JINJATemplatValues
                               

