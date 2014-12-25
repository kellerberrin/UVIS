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
     * "http:localhost:9080") or in Production (uses the database endpoints at
     * "https:kellerberrin-drugdatabase.appspot.com").
     * Note that either environment = "Test" or environment = "Production" must be commented out.
     *
     *********************************************************************************************/

    drugSearchApp.factory("AppConfig", function ($resource) {


// Comment one of these out to define the environment
//        var environment = "Test";
        var environment = "Production";

        var promptEndPointURL = "/_ah/api/searchUSdrugs/v1/forwardPrompt";
        var searchEndPointURL = "/_ah/api/searchUSdrugs/v1/typeSearch";
        var databaseLocationURL = null;

        if (environment === "Production") {

            databaseLocationURL = "https://kellerberrin-drugdatabase.appspot.com";

        }
        else {

            databaseLocationURL = "http://localhost:9080";

        }

        var promptCacheSize = 100;
        var promptMaxResults = 10;
        var searchcacheSize = 100;
        var searchMaxResults = 100;

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

            searchcacheSize : function() {

                return searchcacheSize;

            },

            searchMaxResults : function() {

                return searchMaxResults;

            }

        };


    });

})(window, window.angular);
