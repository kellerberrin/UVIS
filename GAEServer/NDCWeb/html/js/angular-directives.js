"use strict";

/* Directives */


(function (window, angular, undefined) {


var drugSearchDirectives = angular.module( "drugSearchDirectives", []);



    drugSearchDirectives.directive("kSearchSummary", function() {

        return {

            restrict: "EA",  // attribute

            scope: true,   // child scope that inherits from the parent (controller scope)

            replace: true, // replace the existing HTML tags.

            template: "<div style='background-color:red'>Hello World</div>",

            link: function(scope, elem, attrs) {

                elem.bind("click", function() {

                    elem.css("background-color", "white");

                    scope.$apply(function() {

                        scope.color = "white";

                    });

                });

                elem.bind("mouseover", function() {

                    elem.css("cursor", "pointer");

                });

            }
        };

    });


/****************************************************************************
 *
 * Respond to a key press event
 * Usage :  key-bind="{ enter: 'getParamsSearch()' }"
 *
 ****************************************************************************/


    drugSearchDirectives.constant("keyCodes", {
        esc: 27,
        space: 32,
        enter: 13,
        tab: 9,
        backspace: 8,
        shift: 16,
        ctrl: 17,
        alt: 18,
        capslock: 20,
        numlock: 144
    });

    drugSearchDirectives.directive("keyBind", ["keyCodes", function (keyCodes) {
        function map(obj) {
            var mapped = {};
            utilityModule.k_consoleLog(["map", obj]);
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function (scope, element, attrs) {
            utilityModule.k_consoleLog(["key-bind executes", keyCodes, scope, element, attrs]);
            var bindings = map(scope.$eval(attrs.keyBind));
            element.bind("keydown keypress", function (event) {
                if (bindings.hasOwnProperty(event.which)) {
                    scope.$apply(function() {
                        scope.$eval(bindings[event.which]);
                    });
                }
            });
        };
    }]);


/****************************************************************************
 *
 * Handle focusin and focusout events
 * Usage :  k-focusin="aFunction($event)"
 * Usage :  k-focusout="aFunction($event)"
 *
 ****************************************************************************/


    drugSearchDirectives.directive("kFocusin", ["$parse", function($parse) {

        return function (scope, element, attr) {

            var fn = $parse(attr["kFocusin"]);

            element.bind("focusin", function (event) {

                scope.$apply(function () {

                    fn(scope, {$event: event});

                });

            });

        }


    }]);


    drugSearchDirectives.directive("kFocusout", ["$parse", function($parse) {

        return function(scope, element, attr) {

                var fn = $parse(attr["kFocusout"]);

                element.bind("focusout", function (event) {

                    scope.$apply(function () {

                        fn(scope, {$event: event});

                    });

                });

            }


    }]);


})(window, window.angular);
