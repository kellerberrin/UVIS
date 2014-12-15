"use strict";


(function (window, angular, undefined) {


    /* Services */

    var drugSearchServices = angular.module("drugSearchServices", []);


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


    drugSearchServices.factory("ImageSearchDialog", [ "DrugSearch", function (DrugSearch) {

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

            getImage : function() {

                return imageSearchDialog.imageurl;

            },

            searchImage: function () {

                imageSearchDialog.show = false;
                DrugSearch.performSearch(imageSearchDialog.searchParams);
            }

        }

    }]);


    drugSearchServices.factory("ConfirmSearchDialog", ["$q", function ($q) {


        var confirmSearchDialog = {
            show: false, // Display the dialog box
            reason: null, // Set the error message
            dialogStyle: {width: "80%", "max-width": "500px"}
        }; // Set the dialog width
        var deferred = null;

        return {

            initialize: function () {

                return confirmSearchDialog;

            },

            displayConfirm: function (reason) {

                deferred = $q.defer();  // Reset the promise.

                confirmSearchDialog.reason = reason; // Display the reason in the dialog.
                confirmSearchDialog.show = true; //show the dialog

                return deferred.promise; // Return the promise.

            },

            modifySearch : function (modify) {

                confirmSearchDialog.show = false;
                deferred.resolve(modify);

            },

            reason: function() {

                return confirmSearchDialog.reason;

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

            },

            status : function() {

                return searchErrorDialog.status;

            },

            statusText : function() {

                return searchErrorDialog.statusText;

            },

            action : function() {

                return searchErrorDialog.action;

            }

        }

    });


    drugSearchServices.factory("InputSearchTypes", function () {


        var displayTypeArray = [];

        // Define the text input search types.

        var searchTypes = [
            {type: "name", typeprompt: "Name", defaulttext: "Livalo"},
            {type: "active", typeprompt: "Ingredient", defaulttext: "Pitavastatin"},
            {type: "ndc", typeprompt: "Code (NDC)", defaulttext: "0002-4772-90"},
            {type: "ingredient", typeprompt: "Ingredient (Extended+)", defaulttext: "Pitavastatin"},
            {type: "image", typeprompt: "Image Search (NDC9+)", defaulttext: "00002-4772"}
        ];

        var getdisplaytype = function (type) {  // Given a parameter search type, return the appropriate text input search type

            if (type == "name") {

                return searchTypes[0];

            } else if (type == "active") {

                return searchTypes[1];

            } else if (type == "ndc") {

                return searchTypes[2];

            } else if (type == "ingredient") {

                return searchTypes[3];

            } else if (type == "image") {

                return searchTypes[4];

            } else {  // Should not happen

                utilityModule.k_consoleLog("get display prompt - Badtype");
                return searchTypes[0];

            }

        };


        var getTypesArray = function () {

            displayTypeArray = [];

            for (var i = 0; i < searchTypes.length; i++) {

                if (textdisplaytype(searchTypes[i].type)) {

                    displayTypeArray.push(searchTypes[i]);

                }

            }

            return displayTypeArray;

        };

        var textdisplaytype = function (type) {  // Given a search type; check if this a text input search.

            return (type == "name" || type == "active" || type == "ndc");

        };


        return {

            getdisplaytype : getdisplaytype,

            getTypesArray : getTypesArray,

            textdisplaytype : textdisplaytype

        };

    });

})(window, window.angular);















