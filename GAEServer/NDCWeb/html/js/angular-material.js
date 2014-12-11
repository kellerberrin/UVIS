"use strict";

/* Directives */

(function (window, angular, undefined) {


var materialComponents = angular.module( "materialComponents", []);



/****************************************************************************
 *
 * A general purpose dialog directive
  *
 ****************************************************************************/


    materialComponents.directive('kMaterialDialog', function() {

        return {

            restrict: "E",

            scope: { displayDialog: "=displaydialog" },   // Isolate scope (only for template below).

            replace: true, // Replace with the template below

            transclude: true, // we want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                scope.dismissDialog =function() {

                    scope.displayDialog.show = false;

                }

            },

            templateUrl: "partial/MaterialDialogTemplate.html"

        }; // end of return

    }); // end of directive.



})(window, window.angular);
