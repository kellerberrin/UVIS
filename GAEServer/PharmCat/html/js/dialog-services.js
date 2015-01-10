"use strict";


(function (window, angular, undefined) {


    /* Services */

    var dialogServices = angular.module("kDialogServices", []);


    /*********************************************************************************************
     *
     * A dialog to display a hi-res drug image and launch an image search.
     * Defined at the top level in Index.html
     *
     *********************************************************************************************/

    dialogServices.factory("ExampleSearchDialog", [ "DrugSearch", function (DrugSearch) {

        var exampleSearchDialog = {
            show: false, // Display the dialog box
            searchParams: null, // Example search parameters
            dialogStyle: {width: "80%", "max-width": "450px"}
        }; // Set the dialog width


        return {

            initialize: function () {

                return exampleSearchDialog;

            },

            displayExampleSearchDialog: function () {

                exampleSearchDialog.show = true;

            },

            exampleSearch: function () {

                exampleSearchDialog.show = false;
                DrugSearch.nameSearch("cattail");

            }

        }

    }]);


    /*********************************************************************************************
     *
     * A dialog to display a hi-res drug image and launch an image search.
     * Defined at the top level in Index.html
     *
     *********************************************************************************************/

    dialogServices.factory("ImageSearchDialog", [ "DrugSearch", function (DrugSearch) {

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

    /*********************************************************************************************
     *
     * A dialog to validate search input text.
     * Defined at the top level in Index.html
     *
     *********************************************************************************************/

    dialogServices.factory("ConfirmSearchDialog", ["$q", function ($q) {


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

    /*********************************************************************************************
     *
     * A dialog to display any errors from the search endpoints.
     * Defined at the top level in Index.html
     *
     *********************************************************************************************/

    dialogServices.factory("SearchErrorDialog", function () {

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

    /*********************************************************************************************
     *
     * A dialog to display the barcode reader functionality.
     * Defined at the top level in Index.html
     *
     *********************************************************************************************/

    dialogServices.factory("BarCodeDialog", function () {

        var barCodeDialog = {
            show: false, // Display the dialog box
            dialogStyle: {width: "80%", "max-width": "400px"}, // Set the dialog width
            GTIN : "GTIN",
            authenticationCode : "Authentication Code",
            batch : "Batch Number",
            expiryDate: "Expiry Date"
        };

        return {

            initialize: function () {

                return barCodeDialog;

            },

            displayBarCodeDialog: function () {

                barCodeDialog.show = true;

            },

            GTIN : function() {

                return barCodeDialog.GTIN

            },

            authenticationCode : function() {

                return barCodeDialog.authenticationCode;

            },

            batch : function() {

                return barCodeDialog.batch;

            },

            expiryDate : function() {

                return barCodeDialog.expiryDate;

            }

        }

    });


    /*********************************************************************************************
     *
     * A popup toast to summarize the search results.
     * Defined at the top level in Index.html
     * Note that this is NOT inherited from a material toast type.
     *
     *********************************************************************************************/

    dialogServices.factory("SearchToast", [ "$interval", function ($interval) {

        var displaySearchToast = {
            show: false, // Display the dialog box
            timeOut: 4000, // Timeout in milliseconds
            searchMessage: "" // Set the search message
        }; // Set the toast width

        var intervalPromise = null;

        var dismissToast = function() {

            displaySearchToast.show = false;

        };

        return {

            displayToast: function (message) {

                if (intervalPromise != null) {

                    $interval.cancel(intervalPromise);

                }

                displaySearchToast.searchMessage = message;
                displaySearchToast.show = true;
                intervalPromise = $interval( dismissToast, displaySearchToast.timeOut, 1, true);

            },

            message: function () {

                return displaySearchToast.searchMessage;

            },

            show: function () {

                return displaySearchToast.show;

            },

            dismissToast : dismissToast

        }

    }]);

    /*********************************************************************************************
     *
     * The prompt search popup to display prompts.
     * This popup is defined at the bottom of DrugHeader.html
     *
     *********************************************************************************************/

    dialogServices.factory("SearchPromptPopup", function () {

        var displayPopup = {
            show: false,
            popupStyle: {width: "18em", top: "1em", left: "1em"}
        }; // Set the toast width

        return {

            initialize: function () {

                return displayPopup;

            },

            togglePopup: function (displayFlag) {

                displayPopup.show = displayFlag;

            }

        }

    });


})(window, window.angular);















