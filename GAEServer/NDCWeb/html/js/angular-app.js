"use strict";

/* Modules used by the app */

var drugSearchApp = (function (window, angular, undefined) {

    angular.module("drugSearchApp",
        [   "ngAnimate",
            "ngResource",
            "materialComponents",
            "drugSearchDirectives",
            "drugSearchServices",
            "searchPrompt",
            "drugSearchControllers",
            "searchServices"
        ]);

})(window, window.angular);
