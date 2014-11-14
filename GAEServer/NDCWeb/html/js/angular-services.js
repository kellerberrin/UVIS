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

USDrugServices.factory("SearchPrompts", function () {

    var historyArray = [];
    var promptArray = [];
    var blankSearch = { searchstring : "", searchtype : "name"};   // A blank search if no available search history.
    var currentSearch = blankSearch; // The current active search.
    var historyActive = false; // Set when the search history is active
    var promptActive = false; // Set when type-ahead prompt is active
    var focusActive = false;

    // Define the text input search types.

    var searchTypes = [
        {type: "name", typeprompt: "Name", defaulttext: "Livalo"},
        {type: "active", typeprompt: "Ingredient", defaulttext: "Pitavastatin"},
        {type: "ndc", typeprompt: "Code (NDC)", defaulttext: "0002-4772-90"}
    ];

    var displaySearch = { selectedsearchtype: searchTypes[0], searchtext: "" };

    var getdisplaytype = function (type) {  // Given a parameter search type, return the appropriate text input search type

        if (type == "name") {

            return searchTypes[0];

        } else if (type == "active") {

            return searchTypes[1];

        } else if (type == "ndc") {

            return searchTypes[2];

        } else {  // Should not happen

            k_consoleLog("get display prompt - Badtype");
            return searchTypes[0];

        }

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

            displaySearch.selectedsearchtype = getdisplaytype(blankSearch.searchtype); //Deep copy
            displaySearch.searchtext = blankSearch.searchstring;

        }

    };


    var setpromptstatus = function() {

        if (focusActive) {

            historyActive = true;

        }
        else {

            historyActive =false;

        }

    };


    return {

        getdisplaysearch : function() {

            return displaySearch;

        },

        getsearchtypes : function() {

            return searchTypes;

        },

        setnamepromptarray : function(nameArray) {

            promptArray = [];

            for (var i = 0; i < nameArray.length; i++) {

                var promptSearch = { searchstring : nameArray[i], searchtype : "name"};
                promptArray.push(promptSearch);

            }

        },

        getdisplaytype: getdisplaytype,

        setfocus: function(focus) {

            focusActive = focus;
            setpromptstatus();

        },

        gethistoryactive: function() {

            return historyActive;

        },

        gethistoryarray: function() {


            return historyArray;

        },

        getpromptactive: function() {

            return promptActive;

        },

        getpromptarray: function() {


            return promptArray;

        },

        clearpromptarray : function() {


            promptArray = [];

        },

        gettcurrentsearch : function() {

            return currentSearch;

        },

        setcurrentsearch : function(searchParams) {

            currentSearch = searchParams;
            // Set the displayed text search (if applicable)
            paramToTextSearch(searchParams);

        },

        addtohistory : function(searchParams) {

                historyArray.unshift(searchParams);

        }
    };

});


USDrugServices.factory("USDrugEndPoints", ["$resource", function ($resource) {

    return $resource("/_ah/api/searchUSdrugs/v1/typeSearch"   //url

        , {   }    // default arguments

        , { typeSearch: { method: "POST"
                        , params: {searchstring: "@searchstring", searchtype: "@searchtype"}
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
            , params: {promptstring: "@promptstring", promptsize: "@promptsize"}
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
                    + "looks like a National Drug Code (NDC). Do you want to search by 'Code (NDC)'?";
                failure({ searchstring: SearchString, searchtype: "ndc" }, HelpText);
                return;
            }

        } else if (SearchType == "ndc") {

            if (SearchLength == 0) {

                SearchString = "0002-4770-90";

            }
            else if ((2 * DigitLength) <= SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a drug name. Do you want to search by 'Name'?";
                failure({ searchstring: SearchString, searchtype: "name" }, HelpText);
                return;
            }
            else if (DigitLength != 10) {

                HelpText = "The text entered; " + "'" + SearchString + "' " + " has " + DigitLength + " digits."
                    + " Most National Drug Codes (NDC) are 10 digits long. Do you want to continue the search?";
                failure({ searchstring: SearchString, searchtype: SearchType }, HelpText);
                return;
            }

        } else if (SearchType == "active") {

            if (SearchLength == 0) {
                SearchString = "Pitavastatin";
            }
            else if ((2 * DigitLength) > SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Do you want to search by 'Code (NDC)'?";
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


USDrugServices.factory("USDrugShowDialog",

    [ "$mdDialog"
        , function ($mdDialog) {

        function DisplayYesNoDialog(message, yesFunc, noFunc, dismissFunc) {

            $mdDialog.show({
                templateUrl: "/partial/DialogTemplate.html", resolve: { message: function () {
                    return message;
                }, yesFunc: function () {
                    return yesFunc;
                }, noFunc: function () {
                    return noFunc;
                } }, controller: [ "$scope"
                    , "$mdDialog"
                    , "message"
                    , "yesFunc"
                    , "noFunc"
                    , function ($scope, $mdDialog, message, yesFunc, noFunc) {

                        $scope.dialog = { message: message };

                        $scope.yesDialog = function () {
                            $mdDialog.hide(yesFunc);
                        };

                        $scope.noDialog = function () {
                            $mdDialog.hide(noFunc);
                        };

                    }]
            }).then(function (responseFunc) {
                responseFunc();
            }, dismissFunc);
        }

        return { DisplayYesNoDialog: DisplayYesNoDialog };

    }]);



USDrugServices.factory("USDrugImageDialog",

    [ "$mdDialog"
        , function ($mdDialog) {

        function DisplayImageDialog(imageURL, searchFunc, dismissFunc) {

            $mdDialog.show({
                templateUrl: "/partial/DialogImageTemplate.html", resolve: { imageURL: function () {
                    return imageURL;
                }, searchFunc: function () {
                    return searchFunc;
                }, dismissFunc: function () {
                    return dismissFunc;
                } }
                , controller: [ "$scope"
                    , "$mdDialog"
                    , "imageURL"
                    , "searchFunc"
                    , function ($scope, $mdDialog, imageURL, searchFunc) {

                        $scope.dialog = { imageURL: imageURL };

                        $scope.searchDialog = function () {
                            $mdDialog.hide(searchFunc);
                        };
                        $scope.dismissDialog = function () {
                            $mdDialog.hide(dismissFunc);
                        };

                    }]
            }).then(function (responseFunc) {
                responseFunc();
            }, dismissFunc);
        }

        return { DisplayImageDialog: DisplayImageDialog };

    }]);















