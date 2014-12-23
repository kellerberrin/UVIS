"use strict";

/* Modules used by the app */

(function (window, angular, undefined) {

    var drugSearchApp = angular.module("kSearchApp",
        [   "ngAnimate",
            "ngResource",
            "kMaterialComponents",
            "kSearchDirectives",
            "kInputServices",
            "kDialogServices",
            "kSearchPrompt",
            "kSearchControllers",
            "kSearchServices"
        ]);

})(window, window.angular);
