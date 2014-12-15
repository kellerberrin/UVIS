"use strict";


(function (window, angular, undefined) {


    /* Services */

    var searchServices = angular.module("searchServices", ["ngResource",
                                                            "searchPrompt",
                                                            "drugSearchServices" ]);

    /* Drug result arrays scope injection */

    searchServices.factory("DrugArray", function () {

        var drugArray = [];
        var searchActive = false;
        var maxRecords = 100;

        var getMaxRecords = function() {

            return maxRecords;

        };

        var setSearchActive = function(active) {

            searchActive = active;

        };

        var getSearchActive = function() {

            return searchActive;

        };

        var setDrugArray = function(array) {

            drugArray = array;

        };

        var getDrugArray = function() {

            return drugArray;

        };


        return {

            getMaxRecords: getMaxRecords,

            setSearchActive: setSearchActive,

            getSearchActive: getSearchActive,

            setDrugArray : setDrugArray,

            getDrugArray : getDrugArray
        };

    });


    searchServices.factory("DrugSearch", ["DrugArray",
                                        "SearchEndPoints",
                                        "SearchPrompts",
                                        "SearchToast",
                                        "SearchErrorDialog",
                                        function (DrugArray,
                                                SearchEndPoints,
                                                SearchToast,
                                                SearchPrompts,
                                                SearchErrorDialog) {


        var performSearch = function (searchParams) {

            var requestTime = Date.now();
            DrugArray.setSearchActive(true);
            searchParams.searchsize = DrugArray.getMaxRecords();  // Set the max search size to 100 for now.

            SearchEndPoints.typeSearch(searchParams,

                 function (data) {
                    DrugArray.setDrugArray(data.drugArray);
                    if (data.drugArray.length > 0) {
                        SearchPrompts.addToHistory(searchParams);
                    }
                    DrugArray.setSearchActive(false);
                    var milliseconds = Date.now() - requestTime;
                    resultToast(milliseconds);
                },

                 function (error) {

                    DrugArray.setSearchActive(false);
                    DrugArray.setDrugArray([]);
                    SearchErrorDialog.displayError(error);
                    utilityModule.k_consoleLog(["USDrugEndPoints - error", error]);

                });

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

        var resultToast = function (milliseconds) {

            var ToastText = utilityModule.k_drugCount(DrugArray.getDrugArray().length, milliseconds);
            SearchToast.displayToast(ToastText);

        };

        return {

            performSearch: performSearch,

            nameSearch: nameSearch,

            ingredientSearch: ingredientSearch,

            ndc9Search: ndc9Search

        };

    }]);


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

            message : function() {

                return displayToast.searchMessage;

            }

        }

    });


})(window, window.angular);















