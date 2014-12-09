"use strict";

/* Services */

var USDrugServices = angular.module("USDrugServices", ["ngResource"]);




/* Drug result arrays scope injection */

USDrugServices.factory("DrugArray", function () {

    return { drugArray : []
           , searchActive: false
    };

});


/* Type ahead prompts and search history scope injection */

USDrugServices.factory("SearchPrompts", [ "USDrugForwardPrompt", function (USDrugForwardPrompt) {

    var historyArray = [];  // History of searches
    var totalPromptCount = 10;
    var displayHistoryArrayCount = 3;
    var displayHistoryArray=[]; // Displayed search history, Length = min(max(3, 10 - promptArray.length), historyArray.length)
    var promptArray = [];  // Search ahead prompts
    var displayPromptArray = [];  // Displayed prompts, Length = min(10-displayHistoryArray, promptArray.length))
    var blankSearch = { searchstring : "", searchtype : "name"};   // A blank search if no available search history.
    var currentSearch = blankSearch; // The current active search.
    var historyActive = false; // Set when the search history is active
    var promptActive = false; // Set when type-ahead prompt is active
    var focusActive = false; // Does the input text widget have focus

    // Define the text input search types.

    var searchTypes = [
        {type: "name", typeprompt: "Name", defaulttext: "Livalo"},
        {type: "active", typeprompt: "Ingredient", defaulttext: "Pitavastatin"},
        {type: "ndc", typeprompt: "Code (NDC)", defaulttext: "0002-4772-90"},
        {type: "ingredient", typeprompt: "Ingredient (Extended+)", defaulttext: "Pitavastatin"},
        {type: "image", typeprompt: "Image Search (NDC9+)", defaulttext: "00002-4772"}
    ];

    var displaySearch = { selectedsearchtype: searchTypes[0], searchtext: "" };  // This object is bound to the input HTML

    var getdisplaytype = function (type) {  // Given a parameter search type, return the appropriate text input search type

        if (type == "name") {

            return searchTypes[0];

        } else if (type == "active") {

            return searchTypes[1];

        } else if (type == "ndc") {

            return searchTypes[2];

        } else if (type == "ingredient") {

            return searchTypes[3];

        } else if (type == "image") {

            return searchTypes[4];

        } else {  // Should not happen

            k_consoleLog("get display prompt - Badtype");
            return searchTypes[0];

        }

    };


    var getdisplayarray = function() {

        var displayTypeArray = [];

        for (var i = 0; i < searchTypes.length; i++) {

            if (textdisplaytype(searchTypes[i].type)) {

                displayTypeArray.push(searchTypes[i]);

            }

        }

        return displayTypeArray;

    };

    var textdisplaytype = function (type) {  // Given a search type; check if this a text input search.

        return (type == "name" || type == "active" || type == "ndc");

    };


    var paramToTextSearch = function (paramSearch) { // note the the new values are assigned to the displaySearch
        // object, because the current object is bound to the text search HTML.

        if (textdisplaytype(paramSearch.searchtype)) { // Setup the displayed search

            displaySearch.selectedsearchtype = getdisplaytype(paramSearch.searchtype);
            displaySearch.searchtext = paramSearch.searchstring;

        }
        else { // Otherwise blank out the search fields

            displaySearch.selectedsearchtype = getdisplaytype(blankSearch.searchtype);
            displaySearch.searchtext = blankSearch.searchstring;

        }

    };


    var setfocus = function(focus) {

        focusActive = focus;

    };


    var setpromptstatus = function() {

        if (focusActive) {

            historyActive = true;
            if (displaySearch.searchtext.length > 0) {

                promptActive = true;

            } else {

                promptActive = false;
                promptArray = [];
                setdisplaypromptarrays();

            }

        }
        else {

            historyActive =false;
            promptActive = false;

        }

        if (historyActive && historyArray.length == 0) {

            historyActive = false;

        }

        if (promptActive) {

            getForwardPrompt();

        }

    };

    var getForwardPrompt = function () {

        k_consoleLog(displaySearch);

        if (displaySearch.searchtext.length > 0) {

            var promptParams = {promptstring: displaySearch.searchtext, prompttype: displaySearch.selectedsearchtype.type, promptsize: "10"};
            var requestTime = Date.now();
            USDrugForwardPrompt.typeSearch(promptParams
                , function (data) {

                    setpromptarray(data.promptArray, promptParams.prompttype);
                    setdisplaypromptarrays();
                    if (promptArray.length == 0) {

                        promptActive = false;

                    }
                    var milliseconds = Date.now() - requestTime;
                    k_consoleLog({milliseconds: milliseconds});
                    k_consoleLog(data.promptArray);

                }
                , function (error) {

                    clearpromptarray();
                    k_consoleLog(["USDrugForwardPrompt - error", error]);

                });


        }
        else {

            clearpromptarray();

        }

    };

    var clearpromptarray  = function() {


        promptArray = [];

    };

    var setpromptarray = function(nameArray, type) {

        clearpromptarray();

        for (var i = 0; i < nameArray.length; i++) {

            var promptSearch = { searchstring : nameArray[i], searchtype : type};
            promptArray.push(promptSearch);

        }

    };

    var setdisplaypromptarrays = function() {

        // Displayed search history, Length = min(max(3, 10 - promptArray.length), historyArray.length)

        displayHistoryArray = [];

        for (var i = 0; i < historyArray.length; i++) {

            if (i >= Math.max(displayHistoryArrayCount, totalPromptCount - promptArray.length)) break;

            displayHistoryArray.push(historyArray[i]);

        }

        // Update the display history array with user friendly text prompts

        for (i = 0; i < displayHistoryArray.length; i++) {

            var historyItem = displayHistoryArray[i];

            displayHistoryArray[i] = historyDisplayText(historyItem);

        }

        // Displayed prompts, Length = min(10-displayHistoryArray.length, promptArray.length))

        displayPromptArray = [];

        for (i = 0; i < promptArray.length; i++) {

            if (i >= totalPromptCount - displayHistoryArray.length) break;

            displayPromptArray.push(promptArray[i]);

        }

    };


    var historyDisplayText = function (historyItem) {

        historyItem["displayhistorytext"] = historyItem.searchstring;
        var type = historyItem.searchtype;

        if (type == "ingredient") {
            var ingredientSearch = JSON.parse(historyItem.searchstring);
            for(var i = 0; i< ingredientSearch.length; i++) {

                if (ingredientSearch[i].activeselected) {

                    var displayHistoryText = ingredientSearch[i].activeName + " ";

                    if (ingredientSearch[i].strengthselected) {

                        displayHistoryText += ingredientSearch[i].strength + " " + ingredientSearch[i].units;

                    }

                    displayHistoryText += " +";
                    historyItem["displayhistorytext"] = displayHistoryText;
                    break;

                }
            }

        } else if (type == "image") {

            var NDC9Array = historyItem.searchstring.split(",");
            if (NDC9Array.length > 0) {

                var displayHistoryText = k_NDC9Format(NDC9Array[0]) + " +";
                historyItem["displayhistorytext"] = displayHistoryText;

            }

        }

        return historyItem;

    };

    return {

        getdisplaysearch : function() {

            return displaySearch;

        },

        getdisplaytype : function(type) {

            return getdisplaytype(type);

        },

        getsearchtypes: getdisplayarray,

        setfocus: function(focus) {

            setfocus(focus);

        },

        setpromptstatus: setpromptstatus,

        getsearchpromptactive: function() {

            return historyActive || promptActive;

        },

        gethistoryactive: function() {

            return historyActive;

        },

        gethistoryarray: function() {


            return displayHistoryArray;

        },

        getpromptactive: function() {

            return promptActive;

        },

        getpromptarray: function() {


            return displayPromptArray;

        },

        setcurrentsearch : function(searchParams) {

            currentSearch = searchParams;
            // Set the displayed text search (if applicable)
            paramToTextSearch(searchParams);

        },

        addtohistory : function(searchParams) {

            historyArray.unshift(searchParams);
            setdisplaypromptarrays();

        }
    };

}]);


USDrugServices.factory("USDrugEndPoints", ["$resource", function ($resource) {

    return $resource("/_ah/api/searchUSdrugs/v1/typeSearch"   //url

        , {   }    // default arguments

        , { typeSearch: { method: "POST"
                        , params: {searchstring: "@searchstring", searchtype: "@searchtype", searchsize: "@searchsize" }
                        , transformResponse: function (jsonData, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.
// todo: add exception handling and error handling here to gracefully fail with suitable messages.

                    var parsedData = new k_clientDrugData();
                    if (typeof jsonData == "string") {
                        var obj1 = angular.fromJson(jsonData);
                        if (typeof obj1.resultMessage == "string") {
                            var obj2 = angular.fromJson(obj1.resultMessage);
                            parsedData.parseJsonData(obj2);
                        }
                    }
                    return { drugArray: parsedData.drugDataArray };
                }
            }
        }
    );

}]);



USDrugServices.factory("USDrugForwardPrompt", ["$resource", function ($resource) {

    return $resource("/_ah/api/searchUSdrugs/v1/forwardPrompt"   //url

        , {   }    // default arguments

        , { typeSearch: { method: "POST"
            , params: {promptstring: "@promptstring", prompttype: "@prompttype", promptsize: "@promptsize"}
            , transformResponse: function (jsonData, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.
// todo: add exception handling and error handling here to gracefully fail with suitable messages.

                obj2 = {};
                if (typeof jsonData == "string") {
                    var obj1 = angular.fromJson(jsonData);
                    if (typeof obj1.resultMessage == "string") {
                        var obj2 = angular.fromJson(obj1.resultMessage);
                    }
                }
                return { promptArray: obj2 };
            }
        }
        }
    );

}]);



USDrugServices.factory("USDrugValidateInput", [ function () {

    function Validate(searchParams, success, failure) {

        var SearchType = searchParams.searchtype;
        var SearchString = searchParams.searchstring;

        var HelpText;

        var SearchLength = SearchString.length;

        var DigitArray = SearchString.match(/[0-9]/g);

        var DigitLength = (DigitArray != null) ? DigitArray.length : 0;

        if (SearchType == "name") {

            if (SearchLength == 0) {

                SearchString = "Livalo";

            } else if ((2 * DigitLength) > SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Modify to search by 'Code (NDC)'?";
                failure({ searchstring: SearchString, searchtype: "ndc" }, HelpText);
                return;
            }

        } else if (SearchType == "ndc") {

            if (SearchLength == 0) {

                SearchString = "0002-4770-90";

            }
            else if ((2 * DigitLength) <= SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a drug name. Modify to search by 'Name'?";
                failure({ searchstring: SearchString, searchtype: "name" }, HelpText);
                return;
            }
            else if (DigitLength != 10 && DigitLength != 9 && DigitLength != 11) {

                HelpText = "The text entered; " + "'" + SearchString + "' " + " has " + DigitLength + " digits."
                    + " Most National Drug Codes are 11 (NDC11) or 10 (NDC10) or 9 (NDC9) digits long. Modify to search by 'Name'?";
                failure({ searchstring: SearchString, searchtype: "name" }, HelpText);
                return;
            }

        } else if (SearchType == "active") {

            if (SearchLength == 0) {
                SearchString = "Pitavastatin";
            }
            else if ((2 * DigitLength) > SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Modify to search by 'Code (NDC)'?";
                failure({ searchstring: SearchString, searchtype: "ndc" }, HelpText);
                return;
            }

        } else {

            k_consoleLog("unknown search type in USDrugValidateInput.Validate");

        }

        success({ searchstring: SearchString, searchtype: SearchType });

    }

    return { Validate: Validate };

}]);



USDrugServices.factory("ImageSearchDialog", function () {

    var imageSearchDialog = { show: false, // Display the dialog box
                               imageurl: '', // Set the hi-res image
                               searchParams: null, // Image search parameters
                               dialogStyle: { width : "95%", "max-width" : "600px" }  }; // Set the dialog width


    return {

        initialize: function() {

            return imageSearchDialog;

        },

        displayImage : function(image, searchParams) {

            imageSearchDialog.imageurl = image;
            imageSearchDialog.searchParams = searchParams;
            imageSearchDialog.show = true;

        },

        searchImage: function() {

            imageSearchDialog.show = false;
            return imageSearchDialog.searchParams;

        }


    }

});



USDrugServices.factory("ConfirmSearchDialog", [ "$q", function ($q) {


    var confirmSearchDialog = { show: false, // Display the dialog box
                                reason: null, // Set the error message
                                dialogStyle: { width : "80%", "max-width" : "500px" }}; // Set the dialog width
    var deferred = null;

    var modifySearch = function(modify) {

        confirmSearchDialog.show = false;
        deferred.resolve(modify);

    };

    confirmSearchDialog.modifySearch = modifySearch;

    return {

        initialize: function() {

            return confirmSearchDialog;

        },

        displayConfirm : function(reason) {

            deferred = $q.defer();  // Reset the promise.

            confirmSearchDialog.reason = reason; // Display the reason in the dialog.
            confirmSearchDialog.show = true; //show the dialog

            return deferred.promise; // Return the promise.

        }

    }

}]);


USDrugServices.factory("SearchErrorDialog", function () {

    var searchErrorDialog = { show: false, // Display the dialog box
                              dialogStyle: { width : "80%", "max-width" : "400px" }}; // Set the dialog width

    var generalAction = "Action. Ensure that you are using a modern browser (Microsoft; at least IE 10)." +
                        " Check your internet connection and retry.";

    var connectionAction = "Action. Confirm that you have a valid internet connection or phone signal and retry.";

    var seterrortext = function (error) {

        searchErrorDialog.status = "Server Error " + error.status;
        searchErrorDialog.action = generalAction;

        if (error.status == 0) {

            searchErrorDialog.status = "No Connection";
            searchErrorDialog.statusText = "Internet Communication Problem";
            searchErrorDialog.action = connectionAction;

        }
        else if (error.status == 500) {

            searchErrorDialog.status = "Server Error " + error.status;
            searchErrorDialog.statusText = "Unknown Internal Error";
            searchErrorDialog.action = generalAction;

        }
        else {

            searchErrorDialog.status = "Server Error " + error.status;
            searchErrorDialog.statusText = error.statusText;
            searchErrorDialog.action = generalAction;

        }

    };

    return {

        initialize: function() {

            return searchErrorDialog;

        },

        displayError : function(error) {

            seterrortext(error);
            searchErrorDialog.show = true;

        }

    }

});














