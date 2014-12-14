"use strict";

/* Controllers */

(function (window, angular, undefined) {


    var drugSearchControllers = angular.module("drugSearchControllers", []);

// Top level controller - contains all the drug data.

    drugSearchControllers.controller("DisplayController",
        ["$scope"
            , "DrugArray"
            , "SearchPrompts"
            , "USDrugEndPoints"
            , "ImageSearchDialog"
            , "SearchErrorDialog"
            , "SearchToast"
            , function DisplayController($scope,
                                         DrugArray,
                                         SearchPrompts,
                                         USDrugEndPoints,
                                         ImageSearchDialog,
                                         SearchErrorDialog,
                                         SearchToast) {

            $scope.results = DrugArray; // Injected array of drugs
            $scope.prompts = SearchPrompts; // injected array of type-ahead and history prompts
            $scope.displayImageDialog = ImageSearchDialog.initialize(); // Link the image dialog box to this scope.
            $scope.displayErrorDialog = SearchErrorDialog.initialize(); // Link the server error dialog box to this scope.
            $scope.displaySearchToast = SearchToast.initialize(); // Link the search toast to this scope.


            $scope.performSearch = function (searchParams) {
                var requestTime = Date.now();
                $scope.results.searchActive = true;
                searchParams.searchsize = 100;  // Set the max search size to 100 for now.
                USDrugEndPoints.typeSearch(searchParams
                    , function (data) {
                        $scope.results.drugArray = data.drugArray;
                        if (data.drugArray.length > 0) {
                            $scope.prompts.addtohistory(searchParams);
                        }
                        $scope.results.searchActive = false;
                        var milliseconds = Date.now() - requestTime;
                        $scope.resultToast(milliseconds);
                    }
                    , function (error) {

                        $scope.results.searchActive = false;
                        $scope.results.drugArray = [];
                        SearchErrorDialog.displayError(error);
                        utilityModule.k_consoleLog(["USDrugEndPoints - error", error]);

                    });

            };

            $scope.nameSearch = function (name) {

                var searchParams = {searchstring: name, searchtype: "name"};
                $scope.performSearch(searchParams);

            };

            $scope.ingredientSearch = function (drugRecord) {

                if ($scope.validSelection(drugRecord)) {

                    var validJSON = JSON.stringify(drugRecord.activeArray);
                    var searchParams = {searchstring: validJSON, searchtype: "ingredient"};
                    $scope.performSearch(searchParams);

                }

            };

            $scope.validSelection = function (drugRecord) {

                var validSelection = false;
                for (var i = 0; i < drugRecord.activeArray.length; i++) {

                    validSelection = validSelection || drugRecord.activeArray[i].activeselected;
                }

                return validSelection;

            };

            $scope.ndc9Search = function (ndc9) {

                var searchParams = {searchstring: ndc9, searchtype: "ndc"};
                $scope.performSearch(searchParams);

            };

            $scope.resultToast = function (milliseconds) {

                var ToastText = utilityModule.k_drugCount($scope.results.drugArray.length, milliseconds);
                SearchToast.displayToast(ToastText);

            };

            $scope.showImageDialog = function (drugRecord) {

                var searchParams = {searchstring: utilityModule.k_NDC9SearchArray(drugRecord), searchtype: "image"};
                ImageSearchDialog.displayImage(drugRecord.largeimageurl, searchParams);

            };

            $scope.imageSearch = function (drugRecord) {

                $scope.performSearch(ImageSearchDialog.searchImage()); // Perform search

            };

        }]);

// This controller is used to retrieve and verify search data.

    drugSearchControllers.controller("SearchController",
        ["$scope",
            "DrugArray",
            "SearchPrompts",
            "InputSearchTypes",
            "USDrugValidateInput",
            "ConfirmSearchDialog",
            function SearchController($scope,
                                      DrugArray,
                                      SearchPrompts,
                                      InputSearchTypes,
                                      USDrugValidateInput,
                                      ConfirmSearchDialog) {

                $scope.results = DrugArray;  // Injected array of drugs.
                $scope.prompts = SearchPrompts; // injected array of type-ahead and history prompts
                $scope.displaySearchDialog = ConfirmSearchDialog.initialize(); // Set the image dialog box.
                $scope.searchTypes = InputSearchTypes; // Search type service.

                $scope.blankSearchParams =  {
                        searchstring: "",
                        searchtype: "name"
                    };

                $scope.getSearchParams = function () {

                    return {
                        searchstring: $scope.search.searchtext,
                        searchtype: $scope.search.selectedsearchtype.type
                    };

                };

                $scope.setSearchParams = function (searchParams) {

                    if (InputSearchTypes.textdisplaytype(searchParams.searchtype)) { // Setup the displayed search

                        $scope.search = {};
                        $scope.search.searchtext = searchParams.searchstring;
                        $scope.search.selectedsearchtype = InputSearchTypes.getdisplaytype(searchParams.searchtype);

                    }
                    else { // Otherwise blank out the search fields

                        $scope.setSearchParams($scope.blankSearchParams);

                    }

                };

                // default search type.

                $scope.setSearchParams($scope.blankSearchParams);

                // Setup a callback to modify the input search fields and perform
                // an unverified search from the prompt popup.

                $scope.promptSearch = function(searchParams) {

                    $scope.setSearchParams(searchParams);
                    $scope.performSearch(searchParams);

                };

                // Verify the input variables and perform the search

                $scope.getParamsSearch = function () {


                    USDrugValidateInput.Validate($scope.getSearchParams(),

                        function (searchParams) {  // validation successful

                            $scope.performSearch(searchParams);

                        },

                        function (modifiedSearchParams, reason) { // validation failed. Offer an Alternative.

                            ConfirmSearchDialog.displayConfirm(reason).then(   // Resolve a promise

                                function (modified) {

                                    if (modified) {

                                        $scope.performSearch(modifiedSearchParams);

                                    } else {

                                        $scope.performSearch(searchParams);

                                    }

                                }
                            )

                        }
                    );

                };


                $scope.inputkeystroke = function (event) {


                    if (event.which === 13) {  // Check if a 'return' key stroke.
                        $scope.getParamsSearch();
                    }
                    else {
                        SearchPrompts.setPromptStatus(true, $scope.getSearchParams());
                    }

                };

                $scope.inputactive = function () {


                    SearchPrompts.setPromptStatus(true, $scope.getSearchParams());

                };

                $scope.delayinactive = function () {

                    setTimeout($scope.inputinactive, 100);

                };

                $scope.inputinactive = function () {

                    SearchPrompts.setPromptStatus(false, $scope.getSearchParams());

                };


            }]);

})(window, window.angular);
