"use strict";

/* Modules used by the app */

var drugSearchApp = (function (window, angular, undefined) {

    angular.module("drugSearchApp",
        [   "ngAnimate",
            "ngResource",
            "materialComponents",
            "drugSearchControllers",
            "drugSearchDirectives",
            "drugSearchServices",
            "searchPrompt"
        ]);

})(window, window.angular);
