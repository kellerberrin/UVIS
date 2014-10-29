"use strict";

/* Controllers */

var USDrugControllers = angular.module("USDrugControllers", []);

// Top level controller - contains all the drug data.

USDrugControllers.controller("DrugSearchCtrl",
    [ "$scope"
        , "$mdToast"
        , "USDrugEndPoints"
        , "USDrugImageDialog"
        , function DrugSearchCtrl($scope, $mdToast, USDrugEndPoints, USDrugIMageDialog) {

        $scope.searchactive = false;

        $scope.performSearch = function (searchParams) {
            var requestTime = Date.now();
            $scope.searchactive = true;
            USDrugEndPoints.typeSearch(searchParams, function (data) {
                $scope.requestResults = data;
                k_consoleLog(data);
                $scope.searchactive = false;
                var milliseconds = Date.now() - requestTime;
                $scope.resultToast(milliseconds);
            });

        };

        $scope.resultToast = function (milliseconds) {

            var ToastText = k_drugCount($scope.requestResults.drugArray.length, milliseconds);
            var ToastOptions = { template: "<md-toast>" + ToastText + "</md-toast>", duration: 3000 };
            $mdToast.show(ToastOptions);

        }

        $scope.imageDialog = function (drugRecord) {

            USDrugIMageDialog.DisplayImageDialog(drugRecord.largeimageurl, function() { k_consoleLog(drugRecord) }, function() {})

        }

    }]);

// This controller is used to retrieve and verify search data.

USDrugControllers.controller("DrugSearchParams",
    [ "$scope"
        , "USDrugValidateInput"
        , "USDrugShowDialog"
        , function DrugSearchParams($scope, USDrugValidateInput, USDrugShowDialog) {

        // Define the search types.

        $scope.searchtypes = [
            { type: "name", typeprompt: "Name", defaulttext: "Livalo" }
            ,
            { type: "active", typeprompt: "Ingredient", defaulttext: "Pitavastatin" }
            ,
            { type: "ndc", typeprompt: "Code (NDC)", defaulttext: "0002-4772-90" }
        ];

        // Setup the default search object bound to the select and input elements

        $scope.search = { selectedsearchtype: $scope.searchtypes[0],
            searchtext: "" };

        // Verify the input variables and perform the search

        $scope.getParamsSearch = function () {

            var searchParams = { searchstring: $scope.search.searchtext, searchtype: $scope.search.selectedsearchtype.type };

            USDrugValidateInput.Validate(searchParams
                , function (searchParams) {  // validation successful

                    $scope.search.searchtext = searchParams.searchstring;
                    $scope.performSearch(searchParams);

                }
                , function (searchParams, reason) { // validation failed. Offer an Alternative.

                    USDrugShowDialog.DisplayYesNoDialog(reason
                        , function () { //Yes

                            $scope.search.searchtext = searchParams.searchstring;
                            $scope.resetSearchType(searchParams.searchtype);
                            $scope.performSearch(searchParams);

                        }
                        , function () { // No

                            $scope.search.searchtext = searchParams.searchstring;
                            searchParams.searchtype = $scope.search.selectedsearchtype.type;
                            $scope.performSearch(searchParams);

                        }
                        , function () { //Dismiss - No

                            $scope.search.searchtext = searchParams.searchstring;
                            searchParams.searchtype = $scope.search.selectedsearchtype.type;
                            $scope.performSearch(searchParams);

                        });

                });

        }

        $scope.resetSearchType = function (type) {

            if (type == "name") {

                $scope.search.selectedsearchtype = $scope.searchtypes[0];

            }  else if (type == "active") {

                $scope.search.selectedsearchtype = $scope.searchtypes[1];

            }  else if (type == "ndc") {

                $scope.search.selectedsearchtype = $scope.searchtypes[2];

            } else {  // Should not happen

                k_consoleLog("resetSearchType - Badtype");
                $scope.search.selectedsearchtype = $scope.searchtypes[0];

            }


        }

        }]);
