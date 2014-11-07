import os
import logging
import json


from google.appengine.ext import ndb


def developmentEnvironment():
    """ Convenience routine to determine development or production environment """
    environment = os.environ['SERVER_SOFTWARE']
    return environment.find('Development') == 0


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
    ninedigitndc = ndb.StringProperty()
    smallimageurl = ndb.StringProperty()
    largeimageurl = ndb.StringProperty()
    ndcnineimagecodes = ndb.StringProperty(repeated=True)
    ndcelevendigit = ndb.StringProperty()
    rxcui = ndb.StringProperty()



# JSON Conversion class for NDCLookup

class JSONClassEncoder(json.JSONEncoder):   # subclass the JSONEncoder class to handle ndb derived objects.

    def default(self, obj):   # overrides the default function for the JSON conversion of non-simple types
        # Convert objects to a dictionary of their representation

        dict = { "__class__": obj.__class__.__name__,
              "__module__":obj.__module__,
              }

        if isinstance(obj, NDCLookup):
            dict.update(obj.to_dict())
        else:
            dict.update(obj.__dict__)
        return dict


def NDCTenDigitFormat(NDC, Format):
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


def ActiveList(Substances, Strengths, Units):
    """Utility function takes separate lists of drugs, strengths and units and returns a list of 3-tuples"""
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
    """Remove empty string from a string list"""
    ResultList = []
    for String in StringList :
        if len(String) > 0 : ResultList.append(String)

    return ResultList


def IngredientQuery(searchString) :
    """Create a datastore active ingredient search query"""
    Index = 0
    Condition = 0
    QueryString = ""

    # Convert JSON string to an array

    searchArray = json.JSONDecoder().decode(searchString)

    for ingredient in searchArray:

        print(ingredient)

        if ingredient["strengthselected"] and ingredient["activeselected"]:
            if Condition == 0:
                QueryString += " WHERE "
            else:
                QueryString += " AND "

            QueryString += "substancelist = " + "'" + ingredient["activeName"].upper() + "'"
            QueryString += " AND activenumeratorstrength = " + "'" + ingredient["strength"] + "'"
            QueryString += " AND activeingredientunit = " + "'" + ingredient["units"] + "'"
            Condition += 1

        elif ingredient["activeselected"]:
            if Condition == 0:
                QueryString += " WHERE "
            else:
                QueryString += " AND "

            QueryString += "substancelist = " + "'" + ingredient["activeName"].upper() + "'"
            Condition += 1

        Index += 1

    return QueryString


def NDC9ArrayQuery(SearchText):

    Condition = 0
    NDC9Array = SearchText.split(",")
    QueryString = "WHERE ninedigitndc IN ("

    for NDC9 in NDC9Array:

        if Condition == 0:
            QueryString += "'" + NDC9.strip() + "'"
        else:
            QueryString += "," + "'" + NDC9.strip() + "'"

        Condition += 1

    QueryString += ")"

    return QueryString


def ReadNDCDatabase(SearchText, SearchType, SearchArray):
    """ Read the NDC database from the Google App Engine Kind NDCLookup"""

    NDCRecords = []
    NDCEnhancedArray = []


    if SearchType=="ndc":
        SearchText = SearchText.upper()
        SearchText = SearchText.strip()
        SearchError = False
        CleanNDC = SearchText.replace("-", "")
        if len(CleanNDC) == 9:
            qNDC = NDCLookup.query(NDCLookup.ninedigitndc == CleanNDC)
        else:
            qNDC = NDCLookup.query(NDCLookup.ndc == CleanNDC)

    elif SearchType == "name":
        SearchText = SearchText.upper()
        SearchText = SearchText.strip()
        SearchError = len(SearchText) == 0
        qNDC = NDCLookup.query(NDCLookup.proprietaryname == SearchText)

    elif SearchType == "ingredient":
        QueryString = IngredientQuery(SearchText)
        logging.info('Executing Ingredient Search: %s', QueryString)
        SearchError = len(QueryString) == 0              
        qNDC= NDCLookup.gql(QueryString)

    elif SearchType == "image":
        SearchText = SearchText.upper()
        SearchText = SearchText.strip()
        QueryString = NDC9ArrayQuery(SearchText)
        logging.info("Executing NDC9 Search: %s", QueryString)
        SearchError = len(QueryString) == 0
        qNDC= NDCLookup.gql(QueryString)

    elif SearchType == "active":
        SearchText = SearchText.upper()
        SearchText = SearchText.strip()
        SearchError = len(SearchText) == 0
        qNDC = NDCLookup.query(NDCLookup.substancename == SearchText)
 
    else:
        SearchError = True

    if not(SearchError) : NDCRecords = qNDC.fetch(limit=100)

    for NDCRecord in NDCRecords:
        NDCRecord.ndc = NDCTenDigitFormat(NDCRecord.ndc, NDCRecord.format)
        NDCRecord.proprietaryname = NDCRecord.proprietaryname.title()
        NDCRecord.nonproprietaryname = NDCRecord.nonproprietaryname.title()
        NDCRecord.packagedescription = NDCRecord.packagedescription.title()

        substancelist = []

        for substance in NDCRecord.substancelist:
            substancelist.append(substance.title())

        NDCRecord.substancelist = substancelist


    TemplateValues = {'NDCRecordArray': NDCRecords,
                    'SearchText': SearchText,
                    'SearchType': SearchType}

    return TemplateValues
                               

def ReadNDCDatabaseJSON(searchtext, searchtype, searcharray):

    return JSONClassEncoder().encode(ReadNDCDatabase(searchtext, searchtype, searcharray))


def ForwardPromptJSON(forwardprompt, maxpromptsize):

    promptArray = []
    cleanPromptArray = []
    QueryString = "SELECT DISTINCT proprietaryname  FROM NDCLookup WHERE proprietaryname >= '" \
                  + forwardprompt.upper() + "' LIMIT " + maxpromptsize

    # This Query is fast in production (~100 ms) and unacceptably slow in development (~100000 ms).
    # So the query is by-passed in development to prevent performance bottlenecks.
    if developmentEnvironment():
        promptArray = [ "Livalo"
                       , "Live Oak"
                       , "Live Oak Pollen"
                       , "Liver Tonic"
                       , "Lmd In Dextrose"
                       , "Lmd In Sodium Choride"
                       , "Lo Loestrin Fe"
                       , "Lo Minastrin Fe"
                       , "Lo/ovril-28"
                       , "Loblolly Pine" ]
    else:

        qNDC = ndb.gql(QueryString)
        NDCRecords = qNDC.fetch(limit=int(maxpromptsize))

        for NDCRecord in NDCRecords:
            promptArray.append(NDCRecord.proprietaryname)

    # Strip out any prompts that do not match the prompt string.

    for prompt in promptArray:

        if prompt.upper().find(forwardprompt.upper(), 0, len(forwardprompt)) == 0:

            cleanPromptArray.append(prompt.title())


    logging.info("Prompt Query:%s, Prompt Query Result:%s",  QueryString, cleanPromptArray)

    return JSONClassEncoder().encode(cleanPromptArray)