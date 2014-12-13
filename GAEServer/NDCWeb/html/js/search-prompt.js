"use strict";


(function (window, angular, undefined) {


    /* The Search Prompt */

    var searchPrompt = angular.module("searchPrompt", ["ngResource"]);

    /* The Search Prompt Controller */

    searchPrompt.controller("SearchPromptController",
        ["$scope",
            "SearchPrompts",
            "SearchPromptPopup",
            function SearchPromptController($scope,
                                      SearchPrompts) {

                $scope.prompts = SearchPrompts; // Injected array of type-ahead and history prompts

            }]);

                /* Type ahead prompts and search history scope injection */

    searchPrompt.factory("SearchPrompts", [ "USDrugForwardPrompt",
                                            "SearchPromptPopup",
                                            function (USDrugForwardPrompt, SearchPromptPopup) {

        var historyArray = [];  // History of searches
        var totalPromptCount = 10;
        var displayHistoryArrayCount = 3;
        var displayHistoryArray = []; // Displayed search history, Length = min(max(3, 10 - promptArray.length), historyArray.length)
        var promptArray = [];  // Search ahead prompts
        var displayPromptArray = [];  // Displayed prompts, Length = min(10-displayHistoryArray, promptArray.length))
        var blankSearch = {searchstring: "", searchtype: "name"};   // A blank search if no available search history.
        var currentSearch = blankSearch; // The current active search.
        var historyActive = false; // Set when the search history is active
        var promptActive = false; // Set when type-ahead prompt is active
        var focusActive = false; // Does the input text widget have focus

        // Active the Popup to display search prompts

        var displaySearchPrompt = SearchPromptPopup.initialize();

        // Define the text input search types.

        var searchTypes = [
            {type: "name", typeprompt: "Name", defaulttext: "Livalo"},
            {type: "active", typeprompt: "Ingredient", defaulttext: "Pitavastatin"},
            {type: "ndc", typeprompt: "Code (NDC)", defaulttext: "0002-4772-90"},
            {type: "ingredient", typeprompt: "Ingredient (Extended+)", defaulttext: "Pitavastatin"},
            {type: "image", typeprompt: "Image Search (NDC9+)", defaulttext: "00002-4772"}
        ];

        var displaySearch = {selectedsearchtype: searchTypes[0], searchtext: ""};  // This object is bound to the input HTML

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

                utilityModule.k_consoleLog("get display prompt - Badtype");
                return searchTypes[0];

            }

        };


        var getdisplayarray = function () {

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


        var setfocus = function (focus) {

            focusActive = focus;

        };


        var setpromptstatus = function () {

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

                historyActive = false;
                promptActive = false;

            }

            if (historyActive && historyArray.length == 0) {

                historyActive = false;

            }

            if (promptActive) {

                getForwardPrompt();

            }

            SearchPromptPopup.togglePopup(historyActive || promptActive);

        };

        var getForwardPrompt = function () {

            utilityModule.k_consoleLog(displaySearch);

            if (displaySearch.searchtext.length > 0) {

                var promptParams = {
                    promptstring: displaySearch.searchtext,
                    prompttype: displaySearch.selectedsearchtype.type,
                    promptsize: "10"
                };
                var requestTime = Date.now();
                USDrugForwardPrompt.typeSearch(promptParams
                    , function (data) {

                        setpromptarray(data.promptArray, promptParams.prompttype);
                        setdisplaypromptarrays();
                        if (promptArray.length == 0) {

                            promptActive = false;

                        }
                        var milliseconds = Date.now() - requestTime;
                        utilityModule.k_consoleLog({milliseconds: milliseconds});
                        utilityModule.k_consoleLog(data.promptArray);

                    }
                    , function (error) {

                        clearpromptarray();
                        utilityModule.k_consoleLog(["USDrugForwardPrompt - error", error]);

                    });


            }
            else {

                clearpromptarray();

            }

        };

        var clearpromptarray = function () {


            promptArray = [];

        };

        var setpromptarray = function (nameArray, type) {

            clearpromptarray();

            for (var i = 0; i < nameArray.length; i++) {

                var promptSearch = {searchstring: nameArray[i], searchtype: type};
                promptArray.push(promptSearch);

            }

        };

        var setdisplaypromptarrays = function () {

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
                for (var i = 0; i < ingredientSearch.length; i++) {

                    if (ingredientSearch[i].activeselected) {

                        var displayHistoryText = ingredientSearch[i].activeName + " ";

                        if (ingredientSearch[i].strengthselected) {

                            displayHistoryText += ingredientSearch[i].strength + " " + ingredientSearch[i].units;

                        }

                        displayHistoryText += " +";
                        historyItem.displayhistorytext = displayHistoryText;
                        break;

                    }
                }

            } else if (type == "image") {

                var NDC9Array = historyItem.searchstring.split(",");
                if (NDC9Array.length > 0) {

                    displayHistoryText = utilityModule.k_NDC9Format(NDC9Array[0]) + " +";
                    historyItem.displayhistorytext = displayHistoryText;

                }

            }

            return historyItem;

        };

        return {

            displaysearchprompt : function() {

                return displaySearchPrompt;

            },

            getdisplaysearch: function () {

                return displaySearch;

            },

            getdisplaytype: function (type) {

                return getdisplaytype(type);

            },

            getsearchtypes: getdisplayarray,

            setfocus: function (focus) {

                setfocus(focus);

            },

            setpromptstatus: setpromptstatus,

            getsearchpromptactive: function () {

                return historyActive || promptActive;

            },

            gethistoryactive: function () {

                return historyActive;

            },

            gethistoryarray: function () {


                return displayHistoryArray;

            },

            getpromptactive: function () {

                return promptActive;

            },

            getpromptarray: function () {


                return displayPromptArray;

            },

            setcurrentsearch: function (searchParams) {

                currentSearch = searchParams;
                // Set the displayed text search (if applicable)
                paramToTextSearch(searchParams);

            },

            addtohistory: function (searchParams) {

                historyArray.unshift(searchParams);
                setdisplaypromptarrays();

            }
        };

    }]);


    searchPrompt.factory("USDrugForwardPrompt", ["$resource", function ($resource) {

        return $resource("/_ah/api/searchUSdrugs/v1/forwardPrompt"   //url

            , {}    // default arguments

            , {
                typeSearch: {
                    method: "POST"
                    , params: {promptstring: "@promptstring", prompttype: "@prompttype", promptsize: "@promptsize"}
                    , transformResponse: function (jsonData, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.

                        obj2 = {};
                        if (typeof jsonData == "string") {
                            var obj1 = angular.fromJson(jsonData);
                            if (typeof obj1.resultMessage == "string") {
                                var obj2 = angular.fromJson(obj1.resultMessage);
                            }
                        }
                        return {promptArray: obj2};
                    }
                }
            }
        );

    }]);


    searchPrompt.factory("SearchPromptPopup", function () {

        var displayPopup = {
            show: false, // Display the dialog box
            popupStyle: { width: "18em", top: "1em", left: "1em", opacity: "1"}
        }; // Set the toast width

        return {

            initialize: function () {

                return displayPopup;

            },

            togglePopup: function (displayFlag) {

                displayPopup.show = displayFlag;

            }

        }

    });



})(window, window.angular);















