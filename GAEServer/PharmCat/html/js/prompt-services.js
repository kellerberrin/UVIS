"use strict";


(function (window, angular, undefined) {


    /* The Search Prompt */

    var searchPrompt = angular.module("kSearchPrompt", ["ngResource"]);

    /*********************************************************************************************
     *
     * Communicates the prompt data and status to the prompt popup controller
     *
     *********************************************************************************************/

    searchPrompt.factory("PromptArray", [ "SearchPromptPopup", function (SearchPromptPopup) {

        var promptArray = [];
        var historyArray = [];
        var promptActive = false;
        var historyActive = false;
        var readPromptActive = false;
        var currentPrompt = {searchstring: "", searchtype: "name"};
        var focusActive = false;

        var setPromptArray = function (array) {

            promptArray = array;
            setPromptStatus();

        };

        var getPromptArray = function () {

            return promptArray;

        };

        var getPromptActive = function (active) {

            return promptActive;

        };

        var setHistoryArray = function (array) {

            historyArray = array;
            setPromptStatus();

        };

        var getHistoryArray = function () {

            return historyArray;

        };

        var getHistoryActive = function () {

            return historyActive;

        };


        var setReadPromptActive = function(active) {

            readPromptActive = active;

        };


        var getReadPromptActive = function() {

            return readPromptActive;

        };

        var setCurrentPrompt = function(prompt) {

            currentPrompt = prompt;
            setPromptStatus();

        };

        var getCurrentPromptText = function() {

            return utilityModule.k_capitalize(currentPrompt.searchstring);

        };

        var setFocusActive = function(active) {


            focusActive = active;
            setPromptStatus();

        };

        var getFocusActive = function() {

            return focusActive;

        };

        var getPromptTitle = function() {


            return promptArray.length > 0 ? "Search Ahead" : "No Results";

        };

        var setPromptStatus = function () {

            if (getFocusActive()) {


                promptActive = currentPrompt.searchstring.length > 0;
                historyActive = historyArray.length > 0;

            }
            else {

                historyActive = false;
                promptActive = false;

            }

            SearchPromptPopup.togglePopup(historyActive || promptActive);

        };


        return {

// Modify routines.

            setPromptArray: setPromptArray,

            setHistoryArray: setHistoryArray,

            setReadPromptActive: setReadPromptActive,

            setCurrentPrompt: setCurrentPrompt,

            setFocusActive: setFocusActive,

// Retrieval routines.

            getPromptArray: getPromptArray,

            getPromptActive: getPromptActive,

            getHistoryArray: getHistoryArray,

            getHistoryActive: getHistoryActive,

            getReadPromptActive: getReadPromptActive,

            getCurrentPromptText: getCurrentPromptText,

            getFocusActive: getFocusActive,

            getPromptTitle: getPromptTitle

        };

    }]);


    /*********************************************************************************************
     *
     * Connects the prompt search to the popup and the text input widget.
     *
     *********************************************************************************************/

    searchPrompt.factory("SearchPrompts",
        [   "AppConfig",
            "GetForwardPrompts",
            "PromptArray",
            function ( AppConfig,
                       GetForwardPrompts,
                       PromptArray) {

                var historyArray = [];  // History of searches
                var promptArray = [];  // Search ahead prompts


                var setPromptStatus = function (focus, searchParams) {

                    PromptArray.setFocusActive(focus);
                    PromptArray.setCurrentPrompt(searchParams);

                    if (focus && searchParams.searchstring.length > 0) {

                        GetForwardPrompts.getForwardPrompt(searchParams, addToPrompt);

                    } else {

                        promptArray = [];

                    }


                };


                var setDisplayPromptArrays = function () {

                    // Displayed search history, Length = min(max(3, 10 - promptArray.length), historyArray.length)

                    var displayHistoryArray = [];
                    var displayPromptArray = [];

                    for (var i = 0; i < historyArray.length; i++) {

                        if (i >= Math.max(AppConfig.displayHistoryPromptCount(), AppConfig.totalPromptCount() - promptArray.length)) break;

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

                        if (i >= AppConfig.totalPromptCount() - displayHistoryArray.length) break;

                        displayPromptArray.push(promptArray[i]);

                    }

                    PromptArray.setPromptArray(displayPromptArray);
                    PromptArray.setHistoryArray(displayHistoryArray);

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
                    // Capitalize the displayed text.
                    historyItem.displayhistorytext = utilityModule.k_capitalize(historyItem.displayhistorytext);

                    return historyItem;

                };

                var addToHistory = function (searchParams) {

                    historyArray.unshift(searchParams);
                    setDisplayPromptArrays();

                };

                var addToPrompt = function (array) {

                    promptArray = array;
                    setDisplayPromptArrays();

                };


                return {

                    setPromptStatus: setPromptStatus,

                    addToHistory: addToHistory

                };

            }]);


    /*********************************************************************************************
     *
     * The prompt search cache
     *
     *********************************************************************************************/


    searchPrompt.factory("PromptCache", ["AppConfig", function (AppConfig) {

        var cachedPrompt = {inCache: false, promptArray: []};
        var cacheArray = [];
        var cacheForwardParams = {};

        var lookupPromptCache = function (forwardParams) {

            cachedPrompt.inCache = false;
            cachedPrompt.promptArray = [];

            for (var i = 0;  i < cacheArray.length; i++) {

                cacheForwardParams = cacheArray[i].forwardParams;

                if (cacheForwardParams.searchstring == forwardParams.searchstring
                && cacheForwardParams.searchtype == forwardParams.searchtype) {

                    cachedPrompt.inCache = true;
                    cachedPrompt.promptArray = cacheArray[i].promptArray;
                    break;
                }

            }

            return cachedPrompt;

        };

        var addToPromptCache = function(cachedPrompt) {


            cacheArray.unshift(cachedPrompt);

            if (cacheArray.length > AppConfig.promptCacheSize()) {


                cacheArray.pop();

            }

        };

        return {

            lookupPromptCache: lookupPromptCache,

            addToPromptCache : addToPromptCache

        };

    }]);

    /*********************************************************************************************
     *
     * Cached prompt search read
     *
     *********************************************************************************************/


    searchPrompt.factory("GetForwardPrompts", ["AppConfig",
        "ReadForwardPrompts",
        "PromptArray",
        "PromptCache",
        "SearchErrorDialog",
        function (AppConfig,
                  ReadForwardPrompts,
                  PromptArray,
                  PromptCache,
                  SearchErrorDialog) {


            var getForwardPrompt = function (forwardParams, addToPrompt) {

                var cachedPrompt = PromptCache.lookupPromptCache(forwardParams);

                if (cachedPrompt.inCache) {

                    addToPrompt(cachedPrompt.promptArray);

                }
                else {

                    readPrompts(forwardParams, addToPrompt);

                }

            };

            var readPrompts = function (forwardParams, addToPrompt) {

                var promptArray = [];

                var promptParamsSize = {
                    promptstring: forwardParams.searchstring,
                    prompttype: forwardParams.searchtype,
                    promptsize: AppConfig.promptMaxResults().toString()
                };

                var requestTime = Date.now();
                PromptArray.setReadPromptActive(true);

                ReadForwardPrompts.typeSearch(promptParamsSize,

                    function (data) {

                        promptArray = setPromptArray(data.promptArray, promptParamsSize.prompttype);
                        PromptCache.addToPromptCache({forwardParams : forwardParams, promptArray: promptArray});
                        addToPrompt(promptArray);
                        PromptArray.setReadPromptActive(false);

                        var milliseconds = Date.now() - requestTime;
                        utilityModule.k_consoleLog([{milliseconds: milliseconds}, promptArray]);

                    },

                    function (error) {

                        promptArray = [];
                        PromptArray.setReadPromptActive(false);
                        SearchErrorDialog.displayError(error);

                    }

                );

            };


            var setPromptArray = function (searchStringArray, type) {

                var promptArray = [];

                for (var i = 0; i < searchStringArray.length; i++) {

                    var promptSearch = {searchstring: searchStringArray[i], searchtype: type};
                    promptArray.push(promptSearch);

                }

                return promptArray;

            };


            return {

                getForwardPrompt: getForwardPrompt

            };

        }]);

    /*********************************************************************************************
     *
     * The prompt search endpoint for remote database reads.
     *
     *********************************************************************************************/


    searchPrompt.factory("ReadForwardPrompts", ["AppConfig", "$resource", function (AppConfig, $resource) {

        return $resource(AppConfig.promptDatabaseURL()   //url

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



})(window, window.angular);















