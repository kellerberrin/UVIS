"use strict";

/* Controllers */

(function (window, angular, undefined) {


    var drugSearchControllers = angular.module("drugSearchControllers", []);

// Top level controller - handles dialog boxes and wait cursor.

    drugSearchControllers.controller("DisplayController",
        ["$scope",
            "DrugArray",
            "ImageSearchDialog",
            "ConfirmSearchDialog",
            "SearchErrorDialog",
            "SearchToast",
            function DisplayController($scope,
                                       DrugArray,
                                       ImageSearchDialog,
                                       ConfirmSearchDialog,
                                       SearchErrorDialog,
                                       SearchToast) {

                $scope.results = DrugArray;  // Injected array of drugs.
                $scope.imageDialog = ImageSearchDialog; // Link the image dialog box to this scope.
                $scope.searchDialog = ConfirmSearchDialog; // Set the image dialog box.
                $scope.errorDialog = SearchErrorDialog; // Link the server error dialog box to this scope.
                $scope.searchToast = SearchToast; // Link the server error dialog box to this scope.


            }]);

// This controller is used to retrieve and verify search data.

    drugSearchControllers.controller("SearchController",
        ["$scope",
            "DrugArray",
            "DrugSearch",
            "SearchPrompts",
            "InputSearchTypes",
            "USDrugValidateInput",
            "ConfirmSearchDialog",
            function SearchController($scope,
                                      DrugArray,
                                      DrugSearch,
                                      SearchPrompts,
                                      InputSearchTypes,
                                      USDrugValidateInput,
                                      ConfirmSearchDialog) {

                $scope.results = DrugArray;  // Injected array of drugs.
                $scope.prompts = SearchPrompts; // Injected array of type-ahead and history prompts
                $scope.searchTypes = InputSearchTypes; // Search type service
                $scope.drugSearch = DrugSearch; // Performs the actual drug search
                $scope.blankSearchParams = {searchstring: "", searchtype: "name"};

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

                $scope.promptSearch = function (searchParams) {

                    $scope.setSearchParams(searchParams);
                    DrugSearch.performSearch(searchParams);

                };

                // Setup a callback to update the input fields after a search.

                DrugArray.setInputCallback($scope.setSearchParams);

                // Verify the input variables and perform the search

                $scope.getParamsSearch = function () {

                    var searchParams = $scope.getSearchParams();

                    USDrugValidateInput.Validate(searchParams,

                        function (validatedSearchParams) {  // validation successful

                            $scope.setSearchParams(validatedSearchParams);
                            DrugSearch.performSearch(validatedSearchParams);

                        },

                        function (modifiedSearchParams, reason) { // validation failed. Offer an Alternative.

                            ConfirmSearchDialog.displayConfirm(reason).then(   // Resolve a promise

                                function (modified) {

                                    if (modified) {

                                        $scope.setSearchParams(modifiedSearchParams);
                                        DrugSearch.performSearch(modifiedSearchParams);

                                    } else {

                                        DrugSearch.performSearch(searchParams);

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

                    utilityModule.k_consoleLog("Input Active");
                    SearchPrompts.setPromptStatus(true, $scope.getSearchParams());

                };

                $scope.delayinactive = function () {

                    setTimeout($scope.inputinactive, 100);

                };

                $scope.inputinactive = function () {

                    utilityModule.k_consoleLog("Input InActive");
                    SearchPrompts.setPromptStatus(false, $scope.getSearchParams());

                };


            }]);


// This controller is used to display results and execute result searches.

    drugSearchControllers.controller("ResultsController",
        ["$scope",
            "DrugArray",
            "DrugSearch",
            "SearchPrompts",
            "ImageSearchDialog",
            function SearchController($scope,
                                      DrugArray,
                                      DrugSearch,
                                      SearchPrompts,
                                      ImageSearchDialog) {

                $scope.results = DrugArray;  // Injected array of drugs.
                $scope.drugSearch = DrugSearch; // Search type service.
                $scope.prompts = SearchPrompts; // Injected array of type-ahead and history prompts

                // Disable the active ingredient search if no ingredient selected.

                $scope.validSelection = function (drugRecord) {

                    var validSelection = false;
                    for (var i = 0; i < drugRecord.activeArray.length; i++) {

                        validSelection = validSelection || drugRecord.activeArray[i].activeselected;
                    }

                    return validSelection;

                };

                // Show the image dialog box.

                $scope.showImageDialog = function (drugRecord) {

                    var searchParams = {searchstring: utilityModule.k_NDC9SearchArray(drugRecord), searchtype: "image"};
                    ImageSearchDialog.displayImage(drugRecord.largeimageurl, searchParams);

                };


            }]);


})(window, window.angular);
