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
     * A dialog to display any errors from the search endpoints.
     * Defined at the top level in Index.html
     *
     *********************************************************************************************/

    dialogServices.factory("IncompatibleDialog", function () {

        var incompatibilityText = "Sorry - PharmCat is Incompatible with your Web Broswer.";
        var explanation = "PharmCat requires an up-to-date or recent Web Browser version";
        var action = "Action: Install the latest version of your favorite Web Browser and rerun PharmCat";

        var incompatibleDialog = {
            show: false, // Display the dialog box
            dialogStyle: {width: "80%", "max-width": "400px"}, // Set the dialog width
            incompatibilityText : incompatibilityText,
            explanation : explanation,
            action : action
        };


        return {

            initialize: function () {

                return incompatibleDialog;

            },

            displayIncompatible: function (error) {

                incompatibleDialog.show = true;

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
                utilityModule.k_consoleLog(["togglePopup.displayPopup",
                    displayPopup,
                    "displayFlag",
                    displayFlag,
                    "immediate",
                    displayPopup.show ? "True" : "False"]);

            }

        }

    });


})(window, window.angular);















