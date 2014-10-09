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


