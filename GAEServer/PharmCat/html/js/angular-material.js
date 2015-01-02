"use strict";

/* Directives */

(function (window, angular, undefined) {


var materialComponents = angular.module( "kMaterialComponents", []);



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

            transclude: true, // We want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                scope.dismissDialog =function() {

                    scope.displayDialog.show = false;

                }

            },

            templateUrl: "partial/MaterialDialogTemplate.html"

        }; // end of return

    }); // end of directive.


    /****************************************************************************
     *
     * A general purpose toast directive
     *
     ****************************************************************************/


    materialComponents.directive('kMaterialToast', function() {

        return {

            restrict: "E",

            scope: { displayToast: "=displaytoast" },   // Isolate scope (only for template below).

            replace: true, // Replace with the template below

            transclude: true, // we want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                scope.dismissToast =function() {

                    scope.displayToast.show = false;

                }

            },

            templateUrl: "partial/MaterialToastTemplate.html"

        }; // end of return

    }); // end of directive.


    /****************************************************************************
     *
     * A general purpose popup directive
     *
     ****************************************************************************/


    materialComponents.directive('kMaterialPopup', function() {

        return {

            restrict: "E",

            scope: { displayPopup: "=displaypopup" },   // Isolate scope (only for template below).

            replace: true, // Replace with the template below

            transclude: true, // we want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                utilityModule.k_consoleLog(["popup scope", scope]);

                scope.dismissPopup =function() {

                    scope.displayPopup.show = false;
                    utilityModule.k_consoleLog(["popup scope", scope]);

                }

            },

            templateUrl: "partial/MaterialPopupTemplate.html"

        }; // end of return

    }); // end of directive.



})(window, window.angular);
