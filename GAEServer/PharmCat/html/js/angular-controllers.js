"use strict";

/* Controllers */

(function (window, angular, undefined) {


    var searchControllers = angular.module("kSearchControllers", []);


    /*********************************************************************************************
     *
     * Top level controller - handles dialog boxes and wait cursor.
     * defined in Index.html
     *
     *********************************************************************************************/


    searchControllers.controller("DisplayController",
        ["$scope",
            "Browser",
            "DrugArray",
            "ImageSearchDialog",
            "ConfirmSearchDialog",
            "SearchErrorDialog",
            "SearchToast",
             function DisplayController($scope,
                                       Browser,
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

                Browser.checkCompatibility(); // Perform Modernizr checks on browser capability.

            }]);


    /*********************************************************************************************
     *
     * Search Input controller - handles input from the search input and search requests
     * from the search toolbar.
     * Defined in DrugHeader.html
     *
     *********************************************************************************************/


    searchControllers.controller("SearchController",
        ["$scope",
            "DrugArray",
            "DrugSearch",
            "SearchPrompts",
            "InputSearchTypes",
            "ValidateInput",
            "ConfirmSearchDialog",
            function SearchController($scope,
                                      DrugArray,
                                      DrugSearch,
                                      SearchPrompts,
                                      InputSearchTypes,
                                      ValidateInput,
                                      ConfirmSearchDialog) {

                $scope.results = DrugArray;  // Injected array of drugs.
                $scope.drugSearch = DrugSearch; // Performs the actual drug search
                $scope.prompts = SearchPrompts; // Injected array of type-ahead and history prompts
                $scope.searchTypes = InputSearchTypes; // Search type service
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

                    ValidateInput.Validate(searchParams,

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

    /*********************************************************************************************
     *
     * The Search Prompt Controller for the prompt popup.
     * Defined in SearchPrompt.html
     *
     *********************************************************************************************/

    searchControllers.controller("SearchPromptController",
        ["$scope",
            "SearchPrompts",
            "PromptArray",
            "InputSearchTypes",
            function SearchPromptController($scope,
                                            SearchPrompts,
                                            PromptArray,
                                            InputSearchTypes) {

                $scope.prompts = SearchPrompts; // Injected array of type-ahead and history prompts
                $scope.promptArray = PromptArray; // Injected array of type-ahead and history prompts
                $scope.types = InputSearchTypes; // Search

            }]);


    /*********************************************************************************************
     *
     * Search Display controller - displays results from a search and handles result searches.
     * Defined in DrugResults.html
     *
     *********************************************************************************************/


    searchControllers.controller("ResultsController",
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
