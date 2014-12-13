"use strict";


(function (window, angular, undefined) {


    /* Services */

    var drugSearchServices = angular.module("drugSearchServices", ["ngResource"]);


    /* Drug result arrays scope injection */

    drugSearchServices.factory("DrugArray", function () {

        return {
            drugArray: []
            , searchActive: false
        };

    });



    drugSearchServices.factory("USDrugEndPoints", ["$resource", function ($resource) {

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


    drugSearchServices.factory("USDrugValidateInput", [function () {

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
                    + "looks like a National Drug Code (NDC). Modify to search by 'Code (NDC)'?";
                    failure({searchstring: SearchString, searchtype: "ndc"}, HelpText);
                    return;
                }

            } else if (SearchType == "ndc") {

                if (SearchLength == 0) {

                    SearchString = "0002-4770-90";

                }
                else if ((2 * DigitLength) <= SearchLength) {

                    HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a drug name. Modify to search by 'Name'?";
                    failure({searchstring: SearchString, searchtype: "name"}, HelpText);
                    return;
                }
                else if (DigitLength != 10 && DigitLength != 9 && DigitLength != 11) {

                    HelpText = "The text entered; " + "'" + SearchString + "' " + " has " + DigitLength + " digits."
                    + " Most National Drug Codes are 11 (NDC11) or 10 (NDC10) or 9 (NDC9) digits long. Modify to search by 'Name'?";
                    failure({searchstring: SearchString, searchtype: "name"}, HelpText);
                    return;
                }

            } else if (SearchType == "active") {

                if (SearchLength == 0) {
                    SearchString = "Pitavastatin";
                }
                else if ((2 * DigitLength) > SearchLength) {

                    HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Modify to search by 'Code (NDC)'?";
                    failure({searchstring: SearchString, searchtype: "ndc"}, HelpText);
                    return;
                }

            } else {

                utilityModule.k_consoleLog("unknown search type in USDrugValidateInput.Validate");

            }

            success({searchstring: SearchString, searchtype: SearchType});

        }

        return {Validate: Validate};

    }]);


    drugSearchServices.factory("ImageSearchDialog", function () {

        var imageSearchDialog = {
            show: false, // Display the dialog box
            imageurl: '', // Set the hi-res image
            searchParams: null, // Image search parameters
            dialogStyle: {width: "95%", "max-width": "600px"}
        }; // Set the dialog width


        return {

            initialize: function () {

                return imageSearchDialog;

            },

            displayImage: function (image, searchParams) {

                imageSearchDialog.imageurl = image;
                imageSearchDialog.searchParams = searchParams;
                imageSearchDialog.show = true;

            },

            searchImage: function () {

                imageSearchDialog.show = false;
                return imageSearchDialog.searchParams;

            }

        }

    });


    drugSearchServices.factory("ConfirmSearchDialog", ["$q", function ($q) {


        var confirmSearchDialog = {
            show: false, // Display the dialog box
            reason: null, // Set the error message
            dialogStyle: {width: "80%", "max-width": "500px"}
        }; // Set the dialog width
        var deferred = null;

        var modifySearch = function (modify) {

            confirmSearchDialog.show = false;
            deferred.resolve(modify);

        };

        confirmSearchDialog.modifySearch = modifySearch;

        return {

            initialize: function () {

                return confirmSearchDialog;

            },

            displayConfirm: function (reason) {

                deferred = $q.defer();  // Reset the promise.

                confirmSearchDialog.reason = reason; // Display the reason in the dialog.
                confirmSearchDialog.show = true; //show the dialog

                return deferred.promise; // Return the promise.

            }

        }

    }]);


    drugSearchServices.factory("SearchErrorDialog", function () {

        var searchErrorDialog = {
            show: false, // Display the dialog box
            dialogStyle: {width: "80%", "max-width": "400px"}
        }; // Set the dialog width

        var generalAction = "Action. Ensure that you are using a modern browser (Windows - Internet Explorer version 10 or higher)." +
            " Check your internet connection and retry.";

        var connectionAction = "Action. Confirm that you have a valid internet connection or phone signal and retry.";

        var seterrortext = function (error) {


            if (error.status == 0) {

                searchErrorDialog.status = "No Connection";
                searchErrorDialog.statusText = "Internet Communication Problem";
                searchErrorDialog.action = connectionAction;

            }
            else if (error.status == 500) {

                searchErrorDialog.status = "Server Error " + error.status;
                searchErrorDialog.statusText = "Unknown Internal Error";
                searchErrorDialog.action = generalAction;

            }
            else {

                searchErrorDialog.status = "Server Error " + error.status;
                searchErrorDialog.statusText = error.statusText;
                searchErrorDialog.action = generalAction;

            }

        };

        return {

            initialize: function () {

                return searchErrorDialog;

            },

            displayError: function (error) {

                seterrortext(error);
                searchErrorDialog.show = true;

            }


        }

    });


    drugSearchServices.factory("SearchToast", function () {

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

            }

        }

    });


})(window, window.angular);















