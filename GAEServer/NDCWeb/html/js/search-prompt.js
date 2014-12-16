"use strict";


(function (window, angular, undefined) {


    /* The Search Prompt */

    var searchPrompt = angular.module("searchPrompt", ["ngResource"]);

    /* The Search Prompt Controller */

    searchPrompt.controller("SearchPromptController",
        ["$scope",
            "SearchPrompts",
            "InputSearchTypes",
            function SearchPromptController($scope,
                                            SearchPrompts,
                                            InputSearchTypes) {

                $scope.prompts = SearchPrompts; // Injected array of type-ahead and history prompts
                $scope.types = InputSearchTypes;

            }]);

    /* Type ahead prompts and search history scope injection */

    searchPrompt.factory("SearchPrompts",
        ["GetForwardPrompts",
            "SearchPromptPopup",
            function (GetForwardPrompts,
                      SearchPromptPopup) {

                var historyArray = [];  // History of searches
                var totalPromptCount = 10;
                var displayHistoryArrayCount = 3;
                var displayHistoryArray = []; // Displayed search history, Length = min(max(3, 10 - promptArray.length), historyArray.length)
                var promptArray = [];  // Search ahead prompts
                var displayPromptArray = [];  // Displayed prompts, Length = min(10-displayHistoryArray, promptArray.length))
                var historyActive = false; // Set when the search history is active
                var promptActive = false; // Set when type-ahead prompt is active
                var focusActive = false; // Does the text input have focus


                var setPromptStatus = function (focus, searchParams) {


                    focusActive = focus;

                    if (focus && searchParams.searchstring.length > 0) {

                        GetForwardPrompts.getForwardPrompt(searchParams).then(

                            function (array) {

                                promptArray = array;
                                setDisplayPromptArrays();
                                setFocusStatus(focusActive);

                            }

                        );

                    } else {

                        promptArray = [];

                    }

                    setFocusStatus(focusActive);

                };


                var setFocusStatus = function (focus) {

                    if (focus) {


                        promptActive = promptArray.length > 0;
                        historyActive = historyArray.length > 0;

                    }
                    else {

                        historyActive = false;
                        promptActive = false;

                    }

                    SearchPromptPopup.togglePopup(historyActive || promptActive);

                };


                var setDisplayPromptArrays = function () {

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

                    historyItem.displayhistorytext = historyItem.searchstring;
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

                    displaySearchPrompt: function () {
                        return SearchPromptPopup.initialize();  // Initialize the Popup to display search prompts
                    },

                    promptActive: function () {
                        return promptActive;
                    },

                    historyActive: function () {
                        return historyActive;
                    },

                    setPromptStatus: setPromptStatus,

                    getHistoryArray: function () {
                        return displayHistoryArray;
                    },

                    getPromptArray: function () {
                        return displayPromptArray;
                    },

                    addToHistory: function (searchParams) {

                        historyArray.unshift(searchParams);
                        setDisplayPromptArrays();
                        setFocusStatus(focusActive);

                    }

                };

            }]);


    searchPrompt.factory("PromptCache", function () {

        var cachedPrompt = { inCache: false, promptArray: [] };

        var lookupPromptCache = function(forwardParams) {

            return cachedPrompt;

        }

        return {


            lookupPromptCache: lookupPromptCache

        };

    });


    searchPrompt.factory("GetForwardPrompts", ["ReadForwardPrompts",
                                                "$q",
                                                "PromptCache",
                                                "SearchErrorDialog",
                                                function (ReadForwardPrompts,
                                                          $q,
                                                          PromptCache,
                                                          SearchErrorDialog) {

        var deferred = null;

        var setPromptArray = function (searchStringArray, type) {

            var promptArray = [];

            for (var i = 0; i < searchStringArray.length; i++) {

                var promptSearch = {searchstring: searchStringArray[i], searchtype: type};
                promptArray.push(promptSearch);

            }

            return promptArray;

        };

        var getForwardPrompt = function (forwardParams) {

            var promptArray = [];
            deferred = $q.defer();  // Reset the promise;

            var readPrompts = function(forwardParams) {

                var promptParamsSize = {
                    promptstring: forwardParams.searchstring,
                    prompttype: forwardParams.searchtype,
                    promptsize: "10"
                };

                var requestTime = Date.now();

                ReadForwardPrompts.typeSearch(promptParamsSize,

                    function (data) {

                        promptArray = setPromptArray(data.promptArray, forwardParams.prompttype);
                        var milliseconds = Date.now() - requestTime;
                        utilityModule.k_consoleLog([{milliseconds: milliseconds}, data.promptArray]);
                        deferred.resolve(promptArray);

                    },

                    function (error) {

                        promptArray = [];
                        deferred.resolve(promptArray);
                        SearchErrorDialog.displayError(error);

                    });

            };

            var cachedPrompt =  PromptCache.lookupPromptCache(forwardParams);

            if (cachedPrompt.inCache) {

                promptArray = cachedPrompt.promptArray;
                deferred.resolve(promptArray);

            }
            else {

                readPrompts(forwardParams);

            }

            return deferred.promise; // return a promise

        };

        return {

            getForwardPrompt: getForwardPrompt

        };

    }]);


    searchPrompt.factory("ReadForwardPrompts", ["$resource", function ($resource) {

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
            popupStyle: {width: "18em", top: "1em", left: "1em"}
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















