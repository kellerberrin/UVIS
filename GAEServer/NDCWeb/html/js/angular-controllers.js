"use strict";

/* Controllers */

var USDrugControllers = angular.module("USDrugControllers", []);

// Top level controller - contains all the drug data.

    USDrugControllers.controller("DrugSearchCtrl",
        [ "$scope"
        , "$materialToast"
        , "USDrugEndPoints"
        , function DrugSearchCtrl($scope, $materialToast, USDrugEndPoints) {


            $scope.performSearch = function(searchParams) {
                k_consoleLog(searchParams);
                var requestTime = Date.now();
                USDrugEndPoints.typeSearch(searchParams, function(data) {
                    $scope.requestResults = data;
                    k_consoleLog($scope.requestResults);
                    var milliseconds = Date.now() - requestTime;
                    $scope.resultToast(milliseconds);
                });

            };

            $scope.resultToast = function(milliseconds) {

                var ToastText =  "Search found " + $scope.requestResults.NDCEnhancedArraySize + " drugs "
                                 + "(" + (milliseconds / 1000) + " secs)";

                var ToastOptions = { template: "<material-toast>" + ToastText + "</material-toast>", duration: 3000 };

                $materialToast.show(ToastOptions);

            }

        }]);

// This controller is used to retrieve and verify search data.

    USDrugControllers.controller("DrugSearchParams", [ "$scope", function DrugSearchParams($scope) {

        // Define the search types.

        $scope.searchtypes  =  [ { type : "name", typeprompt : "Name", defaulttext : "Livalo" }
            , { type : "active", typeprompt : "Ingredient", defaulttext : "Pitavastatin" }
            , { type : "ndc" , typeprompt : "Code (NDC)" , defaulttext : "0002-4772-90" } ];

        // Setup the default search object bound to the select and input elements

        $scope.search = { selectedsearchtype : $scope.searchtypes[0],
                          searchtext : $scope.searchtypes[0].defaulttext };

        // Verify the input variables and perform the search

        $scope.getParamsSearch = function() {

            var searchParams = { searchstring : $scope.search.searchtext
                               , searchtype : $scope.search.selectedsearchtype.type };
// todo: check the search parameters here.

            // Call the search function defined in the parent scope.

            $scope.performSearch(searchParams);

        }

    }]);