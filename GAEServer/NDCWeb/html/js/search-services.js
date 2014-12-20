"use strict";


(function (window, angular, undefined) {


    /* Services */

    var searchServices = angular.module("searchServices", ["ngResource",
        "searchPrompt",
        "drugSearchServices"]);


    /*********************************************************************************************
     *
     * This object contains the current search state
     *
     *********************************************************************************************/


    searchServices.factory("DrugArray", function () {

        var drugArray = [];
        var searchActive = false;
        var maxRecords = 100;
        var searchParamsCallback = null;

        var getMaxRecords = function () {

            return maxRecords;

        };

        var setSearchActive = function (active) {

            searchActive = active;

        };

        var getSearchActive = function () {

            return searchActive;

        };

        var setDrugArray = function (array) {

            drugArray = array;

        };

        var getDrugArray = function () {

            return drugArray;

        };

        var setInputCallback = function (setSearchParams) {

            searchParamsCallback = setSearchParams;

        };

        var setSearchParams = function (searchParams) {

            if (searchParamsCallback != null) {

                searchParamsCallback(searchParams);

            }

        };

        return {

            getMaxRecords: getMaxRecords,

            setSearchActive: setSearchActive,

            getSearchActive: getSearchActive,

            setDrugArray: setDrugArray,

            getDrugArray: getDrugArray,

            setInputCallback: setInputCallback,

            setSearchParams: setSearchParams
        };

    });

    /*********************************************************************************************
     *
     * The drug search cache
     *
     *********************************************************************************************/

    searchServices.factory("SearchCache", function () {

        var cachedSearch = {inCache: false, drugArray: []};
        var cacheArray = [];
        var cacheSearchParams = {};

        var lookupSearchCache = function (searchParams) {

            cachedSearch.inCache = false;
            cachedSearch.drugArray = [];

            for (var i = 0; i < cacheArray.length; i++) {

                cacheSearchParams = cacheArray[i].searchParams;

                if (cacheSearchParams.searchstring == searchParams.searchstring
                    && cacheSearchParams.searchtype == searchParams.searchtype) {

                    cachedSearch.inCache = true;
                    cachedSearch.drugArray = cacheArray[i].drugArray;
                    break;
                }

            }

            return cachedSearch;

        };

        var addToSearchCache = function (cachedSearch) {


            cacheArray.unshift(cachedSearch);

            if (cacheArray.length > 100) {


                cacheArray.pop();

            }

        };

        return {

            lookupSearchCache: lookupSearchCache,

            addToSearchCache: addToSearchCache

        };

    });

    /*********************************************************************************************
     *
     * Cached search for drugs.
     *
     *********************************************************************************************/

    searchServices.factory("CachedDrugSearch", ["SearchEndPoints",
                                                "SearchCache",
                                                "DrugArray",
                                                "SearchToast",
                                                "SearchPrompts",
                                                "SearchErrorDialog",
                                                function (SearchEndPoints,
                                                          SearchCache,
                                                          DrugArray,
                                                          SearchToast,
                                                          SearchPrompts,
                                                          SearchErrorDialog) {

            var getDrugArray = function (searchParams) {

                var cachedSearch = SearchCache.lookupSearchCache(searchParams);

                if (cachedSearch.inCache) {

                    DrugArray.setSearchActive(true);

                    DrugArray.setDrugArray(cachedSearch.drugArray);

                    if (cachedSearch.drugArray.length > 0) {
                        SearchPrompts.addToHistory(searchParams);
                    }
                    DrugArray.setSearchParams(searchParams);

                    DrugArray.setSearchActive(false);

                    resultToast(-1); // Negative value shows cache hit.

                }
                else {

                    readDrugs(searchParams);

                }

            };

            var readDrugs = function (searchParams) {

                var requestTime = Date.now();
                var searchParamsSize = searchParams;
                searchParamsSize.searchsize = DrugArray.getMaxRecords();  // Set the max search size to 100 for now.

                DrugArray.setSearchActive(true);

                SearchEndPoints.typeSearch(searchParamsSize,

                    function (data) {

                        DrugArray.setDrugArray(data.drugArray);
                        DrugArray.setSearchActive(false);
                        SearchCache.addToSearchCache({searchParams: searchParams, drugArray: data.drugArray});

                        if (data.drugArray.length > 0) {
                            SearchPrompts.addToHistory(searchParams);
                        }

                        DrugArray.setSearchParams(searchParams);

                        var milliseconds = Date.now() - requestTime;
                        resultToast(milliseconds);
                        utilityModule.k_consoleLog([{milliseconds: milliseconds}, data]);

                    },

                    function (error) {

                        DrugArray.setSearchActive(false);
                        DrugArray.setDrugArray([]);
                        SearchErrorDialog.displayError(error);
                        utilityModule.k_consoleLog(["USDrugEndPoints - error", error]);

                    }

                );

            };


            var resultToast = function (milliseconds) {

                var ToastText = utilityModule.k_drugCount(DrugArray.getDrugArray().length, milliseconds);
                SearchToast.displayToast(ToastText);

            };


            return {

                getDrugArray: getDrugArray

            };

        }]);

    /*********************************************************************************************
     *
     * Search for drugs using the remote database.
     *
     *********************************************************************************************/


    searchServices.factory("SearchEndPoints", ["$resource", function ($resource) {

        return $resource("/_ah/api/searchUSdrugs/v1/typeSearch"   //url

            , {}    // default arguments

            , {
                typeSearch: {
                    method: "POST"
                    , params: {searchstring: "@searchstring", searchtype: "@searchtype", searchsize: "@searchsize"}
                    , transformResponse: function (jsonData, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.

                        var parsedData = new utilityModule.K_clientDrugData();
                        if (typeof jsonData == "string") {
                            var obj1 = angular.fromJson(jsonData);
                            if (typeof obj1.resultMessage == "string") {
                                var obj2 = angular.fromJson(obj1.resultMessage);
                                parsedData.parseJsonData(obj2);
                            }
                        }
                        return {drugArray: parsedData.drugDataArray};
                    }
                }
            }
        );

    }]);

    /*********************************************************************************************
     *
     * A popup toast to summarize the search results.
     *
     *********************************************************************************************/

    searchServices.factory("SearchToast", function () {

        var displayToast = {
            show: false, // Display the dialog box
            timeOut: 3500, // Timeout in milliseconds
            searchMessage: "", // Set the hi-res image
            toastStyle: {width: "80%", "max-width": "400px"}
        }; // Set the toast width


        return {

            initialize: function () {

                return displayToast;

            },

            displayToast: function (message) {

                displayToast.searchMessage = message;
                displayToast.show = true;

            },

            message: function () {

                return displayToast.searchMessage;

            }

        }

    });

    /*********************************************************************************************
     *
     * Specification of different drug search types.
     *
     *********************************************************************************************/

    searchServices.factory("DrugSearch", [ "CachedDrugSearch", function (CachedDrugSearch) {


            var performSearch = function (searchParams) {

                CachedDrugSearch.getDrugArray(searchParams);

            };

            var nameSearch = function (name) {

                var searchParams = {searchstring: name, searchtype: "name"};
                performSearch(searchParams);

            };

            var ingredientSearch = function (drugRecord) {

                var validJSON = JSON.stringify(drugRecord.activeArray);
                var searchParams = {searchstring: validJSON, searchtype: "ingredient"};
                performSearch(searchParams);

            };


            var ndc9Search = function (ndc9) {

                var searchParams = {searchstring: ndc9, searchtype: "ndc"};
                performSearch(searchParams);

            };


            return {

                performSearch: performSearch,

                nameSearch: nameSearch,

                ingredientSearch: ingredientSearch,

                ndc9Search: ndc9Search

            };

        }]);


})(window, window.angular);















