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


/****************************************************************************
 *
 * A general purpose dialog directive
 *
 ****************************************************************************/


    USDrugDirectives.directive('kModalDialog', function() {

        return {

            restrict: "E",

            scope: false,

            replace: true, // Replace with the template below

            transclude: true, // we want to insert custom content inside the directive

            link: function(scope, element, attrs) {

                scope.displayDialog = true;

                scope.dialogStyle = {};

                if (attrs.show) {

                    scope.dislayDialog = attrs.show;
                    k_consoleLog(["setShow", scope])

                }

                if (attrs.width) {

                    scope.dialogStyle.width = attrs.width;

                }

                if (attrs.height) {

                    scope.dialogStyle.height = attrs.height;
                }

                scope.dismissDialog = function() {

                    k_consoleLog(["dismissDialog", scope])
                    scope.displayDialog = false;

               };

            },

        template:  "<div class='k-material-modal' ng-show='displayDialog'>" +
                        "<div class='k-material-modal-overlay' ng-click='dismissDialog()'></div>" +
                        "<div class='k-material-modal-dialog'>" +
                            "<div class='k-material-modal-content'></div>" +
                        "</div>"+
                   "</div>"

        }; // end of return

    }); // end of directive.


/****************************************************************************
 *
 * Handle focusin and focusout events
 * Usage :  k-focusin="aFunction($event)"
 * Usage :  k-focusout="aFunction($event)"
 *
 ****************************************************************************/


    USDrugDirectives.directive("kFocusin", ["$parse", function($parse) {

        return function (scope, element, attr) {

            var fn = $parse(attr["kFocusin"]);

            element.bind("focusin", function (event) {

                scope.$apply(function () {

                    fn(scope, {$event: event});

                });

            });

        }


    }]);


    USDrugDirectives.directive("kFocusout", ["$parse", function($parse) {

        return function(scope, element, attr) {

                var fn = $parse(attr["kFocusout"]);

                element.bind("focusout", function (event) {

                    scope.$apply(function () {

                        fn(scope, {$event: event});

                    });

                });

            }


    }]);