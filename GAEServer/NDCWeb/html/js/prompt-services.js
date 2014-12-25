"use strict";


(function (window, angular, undefined) {


    /* The Search Prompt */

    var searchPrompt = angular.module("kSearchPrompt", ["ngResource"]);


    /*********************************************************************************************
     *
     * Connects the prompt search to the popup and the text input widget.
     *
     *********************************************************************************************/

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
                                utilityModule.k_consoleLog(["getForwardPrompt", promptArray]);

                            }
                        );

                    } else {

                        promptArray = [];

                    }

                    utilityModule.k_consoleLog(["getPromptStatus", searchParams, focusActive]);
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

                    utilityModule.k_consoleLog(["togglePopup", historyActive || promptActive]);
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
        "$q",
        "PromptCache",
        "SearchErrorDialog",
        function (AppConfig,
                  ReadForwardPrompts,
                  $q,
                  PromptCache,
                  SearchErrorDialog) {


            var deferred = null;
            var readDeferred = null;

            var getForwardPrompt = function (forwardParams) {

                var promptArray = [];

                deferred = $q.defer();  // Reset the promise;

                var cachedPrompt = PromptCache.lookupPromptCache(forwardParams);

                if (cachedPrompt.inCache) {

                    promptArray = cachedPrompt.promptArray;
                    deferred.resolve(promptArray);

                }
                else {

                    readPrompts(forwardParams).then(

                        function(promptArray) {

                            utilityModule.k_consoleLog(["forwardParams",forwardParams]);
                            PromptCache.addToPromptCache({forwardParams : forwardParams, promptArray: promptArray});
                            deferred.resolve(promptArray);

                        }

                    );

                }

                return deferred.promise; // return a promise

            };

            var readPrompts = function (forwardParams) {

                var promptArray = [];
                readDeferred = $q.defer();

                var promptParamsSize = {
                    promptstring: forwardParams.searchstring,
                    prompttype: forwardParams.searchtype,
                    promptsize: AppConfig.promptMaxResults().toString()
                };

                var requestTime = Date.now();

                ReadForwardPrompts.typeSearch(promptParamsSize,

                    function (data) {

                        promptArray = setPromptArray(data.promptArray, promptParamsSize.prompttype);
                        var milliseconds = Date.now() - requestTime;
                        utilityModule.k_consoleLog([{milliseconds: milliseconds}, promptArray]);
                        readDeferred.resolve(promptArray);

                    },

                    function (error) {

                        promptArray = [];
                        readDeferred.resolve(promptArray);
                        SearchErrorDialog.displayError(error);

                    }

                );

                return readDeferred.promise; // Return the promise

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















