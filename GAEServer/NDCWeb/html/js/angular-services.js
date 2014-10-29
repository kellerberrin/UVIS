"use strict";

/* Services */

var USDrugServices = angular.module("USDrugServices", ["ngResource"]);


USDrugServices.factory("USDrugEndPoints", ["$resource", function ($resource) {

    return $resource("/_ah/api/searchUSdrugs/v1/typeSearch"   //url

        , {   }    // default arguments

        , { typeSearch: { method: "POST"
                        , params: {searchstring: "@searchstring", searchtype: "@searchtype"}
                        , transformResponse: function (jsonData, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.
// todo: add exception handling and error handling here to gracefully fail with suitable messages.

                    var parsedData = new k_clientDrugData();
                    if (typeof jsonData == "string") {
                        var obj1 = angular.fromJson(jsonData);
                        if (typeof obj1.resultMessage == "string") {
                            var obj2 = angular.fromJson(obj1.resultMessage);
                            parsedData.parseJsonData(obj2);
                        }
                    }
                    return { drugArray: parsedData.drugDataArray };
                }
            }
        }
    );

}]);



USDrugServices.factory("USDrugValidateInput", [ function () {

    function Validate(searchParams, success, failure) {

        var SearchType = searchParams.searchtype;
        var SearchString = searchParams.searchstring;

        var HelpText;

        var SearchLength = SearchString.length;

        var DigitArray = SearchString.match(/[0-9]/g);

        var DigitLength = (DigitArray != null) ? DigitArray.length : 0;

        if (SearchType == "name") {

            if (SearchLength == 0) {

                SearchString = "Livalo";

            } else if ((2 * DigitLength) > SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Do you want to search by 'Code (NDC)'?";
                failure({ searchstring: SearchString, searchtype: "ndc" }, HelpText);
                return;
            }

        } else if (SearchType == "ndc") {

            if (SearchLength == 0) {

                SearchString = "0002-4770-90";

            }
            else if ((2 * DigitLength) <= SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a drug name. Do you want to search by 'Name'?";
                failure({ searchstring: SearchString, searchtype: "name" }, HelpText);
                return;
            }
            else if (DigitLength != 10) {

                HelpText = "The text entered; " + "'" + SearchString + "' " + " has " + DigitLength + " digits."
                    + " Most National Drug Codes (NDC) are 10 digits long. Do you want to continue the search?";
                failure({ searchstring: SearchString, searchtype: SearchType }, HelpText);
                return;
            }

        } else if (SearchType == "active") {

            if (SearchLength == 0) {
                SearchString = "Pitavastatin";
            }
            else if ((2 * DigitLength) > SearchLength) {

                HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Do you want to search by 'Code (NDC)'?";
                failure({ searchstring: SearchString, searchtype: "ndc" }, HelpText);
                return;
            }

        } else {

            k_consoleLog("unknown search type in USDrugValidateInput.Validate");

        }

        success({ searchstring: SearchString, searchtype: SearchType });

    }

    return { Validate: Validate };

}]);


USDrugServices.factory("USDrugShowDialog",

    [ "$mdDialog"
        , function ($mdDialog) {

        function DisplayYesNoDialog(message, yesFunc, noFunc, dismissFunc) {

            $mdDialog.show({
                templateUrl: "/partial/DialogTemplate.html", resolve: { message: function () {
                    return message;
                }, yesFunc: function () {
                    return yesFunc;
                }, noFunc: function () {
                    return noFunc;
                } }, controller: [ "$scope"
                    , "$mdDialog"
                    , "message"
                    , "yesFunc"
                    , "noFunc"
                    , function ($scope, $mdDialog, message, yesFunc, noFunc) {

                        $scope.dialog = { message: message };

                        $scope.yesDialog = function () {
                            $mdDialog.hide(yesFunc);
                        };

                        $scope.noDialog = function () {
                            $mdDialog.hide(noFunc);
                        };

                    }]
            }).then(function (responseFunc) {
                responseFunc();
            }, dismissFunc);
        }

        return { DisplayYesNoDialog: DisplayYesNoDialog };

    }]);



USDrugServices.factory("USDrugImageDialog",

    [ "$mdDialog"
        , function ($mdDialog) {

        function DisplayImageDialog(imageURL, searchFunc, dismissFunc) {

            $mdDialog.show({
                templateUrl: "/partial/DialogImageTemplate.html", resolve: { imageURL: function () {
                    return imageURL;
                }, searchFunc: function () {
                    return searchFunc;
                } }, controller: [ "$scope"
                    , "$mdDialog"
                    , "imageURL"
                    , "searchFunc"
                    , function ($scope, $mdDialog, imageURL, searchFunc) {

                        $scope.dialog = { imageURL: imageURL };

                        $scope.searchDialog = function () {
                            $mdDialog.hide(searchFunc);
                        };

                    }]
            }).then(function (responseFunc) {
                responseFunc();
            }, dismissFunc);
        }

        return { DisplayImageDialog: DisplayImageDialog };

    }]);















