"use strict";

/* Modules used by the app */

(function (window, angular, undefined) {

  var drugSearchApp = angular.module("drugSearchApp",
      ["ngAnimate",
        "ngAria",
        "ngMaterial",
        "ngResource",
        "materialComponents",
        "drugSearchControllers",
        "drugSearchDirectives",
        "drugSearchServices"
      ]);

})(window, window.angular);
