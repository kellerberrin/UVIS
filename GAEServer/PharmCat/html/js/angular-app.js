"use strict";

/* Modules used by the app */

(function (window, angular, undefined) {

    var drugSearchApp = angular.module("kSearchApp",
        ["ngAnimate",
            "ngResource",
            "kMaterialComponents",
            "kSearchDirectives",
            "kInputServices",
            "kDialogServices",
            "kSearchPrompt",
            "kSearchControllers",
            "kSearchServices"
        ]);

    /*********************************************************************************************
     *
     * This factory sets up all the application wide constants.
     * In addition, it defines if the application is in Test mode (uses the local database at
     * "http://localhost:9080") or in Production (uses the database endpoints at
     * "https://kellerberrin-drugdatabase.appspot.com").
     * Note that either environment = "Test" or environment = "Production" must be commented out.
     *
     *********************************************************************************************/

    drugSearchApp.factory("AppConfig", function () {


// Comment one of these out to define the database environment
        var environment = "Test";
//        var environment = "Production";

        var promptEndPointURL = "/_ah/api/searchUSdrugs/v1/forwardPrompt";
        var searchEndPointURL = "/_ah/api/searchUSdrugs/v1/typeSearch";
        var databaseLocationURL = null;

        if (environment === "Production") {

            databaseLocationURL = "https://kellerberrin-drugdatabase.appspot.com";

        }
        else {

            databaseLocationURL = "http://localhost:9080";

        }

        var showAuthentication = false; // Enable authentication functionality
        var recaptchaSecretKey = "6LcEZQATAAAAAN7iDxjleVtnEtXyFvptf0fG9_Wx";  // Modify and Remove after testing
        var promptCacheSize = 100;   // Prompt Cache
        var promptMaxResults = 10;   // Prompt Read Size
        var searchCacheSize = 100;   // Drug Search Cache
        var searchMaxResults = 100;  // Drug Search Max Read Size
        var totalPromptCount = 10;   // Total Prompts displayed
        var displayHistoryPromptCount = 3; // Total History prompts count if displaying search prompts

        return {

            promptDatabaseURL: function () {

                return databaseLocationURL + promptEndPointURL;

            },

            searchDatabaseURL: function () {

                return databaseLocationURL + searchEndPointURL;

            },

            promptCacheSize: function () {

                return promptCacheSize;
            },

            promptMaxResults : function() {

                return promptMaxResults;
            },

            searchCacheSize : function() {

                return searchCacheSize;

            },

            searchMaxResults : function() {

                return searchMaxResults;

            },

            totalPromptCount : function() {

                return totalPromptCount;

            },

            displayHistoryPromptCount : function () {

                return displayHistoryPromptCount;

            },

            showAuthentication : function () {

                return showAuthentication;

            }

        };

    });


    drugSearchApp.constant("Modernizr", Modernizr);

    drugSearchApp.factory("Browser", [ "Modernizr",  function (Modernizr) {

        var incompatibilityText = "Sorry - PharmCat is Incompatible with your Web Browser.";
        var explanation = "PharmCat requires an up-to-date or recent Web Browser version.";
        var action = "Solution: Install the latest version of your favorite Web Browser and re-start PharmCat.";
        var browserAlert = incompatibilityText + "\n\n" + explanation + "\n\n" + action;

        var browserCapable = Modernizr.fontface
        && Modernizr.backgroundsize
        && Modernizr.borderimage
        && Modernizr.borderradius
        && Modernizr.boxshadow
        && Modernizr.flexbox
        && Modernizr.opacity
        && Modernizr.rgba
        && Modernizr.textshadow
        && Modernizr.cssanimations
        && Modernizr.csstransitions
        && Modernizr.svg
        && Modernizr.svgclippaths;

        return {

            checkCompatibility: function() {

                if (!browserCapable) {

                    window.alert(browserAlert);

                }

                return browserCapable;

            }

        };


    }]);


    })(window, window.angular);
