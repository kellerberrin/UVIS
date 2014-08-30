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
    substancename = ndb.StringProperty(repeated=True)
    substancelist = ndb.StringProperty(repeated=True)
    activenumeratorstrength = ndb.StringProperty(repeated=True)
    activeingredientunit = ndb.StringProperty(repeated=True)
    pharmclasses = ndb.StringProperty(repeated=True)
    packagedescription = ndb.StringProperty()		

    
class EnhancedNDCLookup :   
    pass
        
        
NDCSEARCHEXAMPLE = "Enter a 10 Digit NDC, Example: '0002477090' or '0002-4770-90'."
GENERICSEARCHEXAMPLE = "Enter a Drug Name, Example 'Livalo' (case insensitive)."
ACTIVESEARCHEXAMPLE = "Enter an Active Ingredient, Example 'Pitavastatin' (case insensitive)."	
INGREDIENTSEARCHEXAMPLE = "Select an Active Ingredient and Strength ('Strength') or just an Active Ingredient ('Include')."	


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

def ActiveList(Substances, Strengths, Units) :
    "Utility function takes separate lists of drugs, strengths and units and returns a list of 3-tuples"    
    SubstanceList = Substances
    StrengthList = Strengths
    UnitList = Units

    Index = 0
    ActiveList = []
    SubstanceList = RemoveEmptyStrings(SubstanceList)
    StrengthList = RemoveEmptyStrings(StrengthList)
    UnitList = RemoveEmptyStrings(UnitList)

    if len(SubstanceList) != len(StrengthList) or len(StrengthList) != len(UnitList) :
        logging.error('Different Sized Lists, len(Substance):%d, len(Strength):%d, len(Unit):%d',  len(SubstanceList), len(StrengthList), len(UnitList) )
        return ActiveList

    while Index < len(SubstanceList) :
        
       Sub = SubstanceList[Index].strip()
       Str = StrengthList[Index].strip()
       Unit = UnitList[Index].strip()
       Tuple = (Sub, Str, Unit)
       ActiveList.append(Tuple)
       Index = Index + 1

    return ActiveList


def RemoveEmptyStrings(StringList) :
    "Remove empty string from a string list"
    ResultList = []
    for String in StringList :
        if len(String) > 0 : ResultList.append(String)

    return ResultList


def IngredientQuery(SearchArray) :
    "Create a datastore active ingredient search query based on search type (include: ingredient only, strength: ingredient and strength)."  
    Index = 0
    Condition = 0
    QueryString = ""
    while Index < len(SearchArray) :

        IngredientTuple = SearchArray[Index]
 
        if IngredientTuple[0] == "strength" :
            if Condition == 0 :
                QueryString = QueryString + " WHERE "    
            else :
                QueryString = QueryString + " AND "

            QueryString = QueryString + "substancelist = " + "'" + IngredientTuple[1] + "'"
            QueryString = QueryString + " AND activenumeratorstrength = " + "'" + IngredientTuple[2] + "'"
            QueryString = QueryString + " AND activeingredientunit = " + "'" + IngredientTuple[3] + "'"
            Condition = Condition + 1

        elif IngredientTuple[0] == "include" :
            if Condition == 0 :
                QueryString = QueryString + " WHERE "    
            else :
                QueryString = QueryString + " AND "

            QueryString = QueryString + "substancelist = " + "'" + IngredientTuple[1] + "'" 
            Condition = Condition + 1

        Index = Index + 1

    return QueryString


    
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

    
def ReadNDCDatabase(SearchText, SearchType, SearchArray):
    " Read the NDC database from the Google App Engine Kind NDCLookup"

    NDCRecords = []
    NDCElevenDigits = ""
    NDCEnhancedArray = []
    
    if SearchType=="ndc":
        SearchExampleText = NDCSEARCHEXAMPLE
        SearchError = not(SearchText.isdigit()) or len(SearchText) != 10  
        qNDC = NDCLookup.query(NDCLookup.ndc == SearchText)

    elif SearchType=="name" :
        SearchExampleText = GENERICSEARCHEXAMPLE
        SearchError = len(SearchText) == 0              
        qNDC = NDCLookup.query(NDCLookup.proprietaryname == SearchText)

    elif SearchType=="ingredient" :
        SearchType=="active"
        SearchExampleText = INGREDIENTSEARCHEXAMPLE
        QueryString = IngredientQuery(SearchArray)
        logging.info('Executing Ingredient Search: %s', QueryString)
        SearchError = len(QueryString) == 0              
        qNDC= NDCLookup.gql(QueryString)

    elif SearchType == "active" :
        SearchExampleText = ACTIVESEARCHEXAMPLE
        SearchError = len(SearchText) == 0              
        qNDC = NDCLookup.query(NDCLookup.substancename == SearchText)
 
    else : 
        SearchError = True
        SearchType = "name"
        SearchExampleText = NDCSEARCHEXAMPLE
        
    if not(SearchError) : NDCRecords = qNDC.fetch(limit=100)

    for NDCRecord in NDCRecords :
        NDCRecord.ndc = NDCTenDigitFormat(NDCRecord.ndc, NDCRecord.format)
        NDCRecord.proprietaryname = NDCRecord.proprietaryname.title()
        NDCRecord.nonproprietaryname = NDCRecord.nonproprietaryname.title()
        NDCElevenDigits = NDCElevenDigitFormat(NDCRecord.ndc, NDCRecord.format)
        NDCEnhanced = EnhancedNDCLookup()
        NDCEnhanced.NDCRecord = NDCRecord
        NDCEnhanced.NDCElevenDigits = NDCElevenDigits
        NDCEnhanced.ActiveList = ActiveList(NDCRecord.substancelist, \
                                            NDCRecord.activenumeratorstrength, \
                                            NDCRecord.activeingredientunit)
        NDCEnhanced.ActiveListSize = len(NDCEnhanced.ActiveList)
        NDCEnhanced.Classes = RemoveEmptyStrings(NDCRecord.pharmclasses)
        NDCEnhancedArray.append(NDCEnhanced)
            
                   
    JINJATemplatValues = { 'NDCEnhancedArray' : NDCEnhancedArray,
                           'NDCEnhancedArraySize' : len(NDCEnhancedArray),
                           'TypeExample' : SearchExampleText, 
                           'SearchText' : SearchText, 
                           'SearchType' : SearchType }

    return JINJATemplatValues
                               

