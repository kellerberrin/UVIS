"use strict";

/* Directives */

var USDrugDirectives = angular.module( "USDrugDirectives", []);

    USDrugDirectives.directive("kSearchSummary", function() {

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


    USDrugDirectives.constant("keyCodes", {
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

    USDrugDirectives.directive("keyBind", ["keyCodes", function (keyCodes) {
        function map(obj) {
            var mapped = {};
            k_consoleLog(["map", obj]);
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function (scope, element, attrs) {
            k_consoleLog(["key-bind executes", keyCodes, scope, element, attrs]);
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

