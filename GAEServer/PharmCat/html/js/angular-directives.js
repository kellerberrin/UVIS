"use strict";

/* Directives */


(function (window, angular, undefined) {


var searchDirectives = angular.module( "kSearchDirectives", []);




/****************************************************************************
 *
 * Handle focusin and focusout events
 * Usage :  k-focusin="aFunction($event)"
 * Usage :  k-focusout="aFunction($event)"
 *
 ****************************************************************************/


    searchDirectives.directive("kFocusin", ["$parse", function($parse) {

        return function (scope, element, attr) {

            var fn = $parse(attr["kFocusin"]);

            element.bind("focusin", function (event) {

                scope.$apply(function () {

                    fn(scope, {$event: event});

                });

            });

        }


    }]);


    searchDirectives.directive("kFocusout", ["$parse", function($parse) {

        return function(scope, element, attr) {

                var fn = $parse(attr["kFocusout"]);

                element.bind("focusout", function (event) {

                    scope.$apply(function () {

                        fn(scope, {$event: event});

                    });

                });

            }


    }]);


    /****************************************************************************
     *
     * A general purpose progress bar
     *
     ****************************************************************************/


    searchDirectives.directive('kPromptProgressBar', function() {

        return {

            restrict: "E",

            scope: { displayProgressBar: "=displayprogressbar" },   // Isolate scope (only for template below).

            replace: true, // Replace with the template below

            transclude: true, // we want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                scope.hideProgressBar =function() {

                    scope.displayProgressBar.show = false;

                }

                scope.showProgressBar =function() {

                    scope.displayProgressBar.show = true;

                }



            },

            templateUrl: "partial/PromptProgress.html"

        }; // end of return

    }); // end of directive.


})(window, window.angular);
