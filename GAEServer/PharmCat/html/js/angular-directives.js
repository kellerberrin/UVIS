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
     * Simple directive to stop event propagation
     * Usage k-stop-event="click" (or some other event name)
     *
     ****************************************************************************/

    searchDirectives.directive('kStopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
            }
        };
    });


    /****************************************************************************
    *
    * Create a dynamic image element.
    * This is a fudge to get around the caching behavior of ngSrc
    *
    ****************************************************************************/


    searchDirectives.directive("kImageOnLoad", function($compile) {

        return {

            restrict: "A",

            link: function(scope, element, attrs) {


// Called when the image value changes.
                attrs.$observe('kImageOnLoad', function(val) {

// remove any pre-existing image elements.
                    $(element).children().remove( );

// Create the new element
                    var html = "<img id='k-dialog-image' src='" + val + "'>";
                    var linkingFunction = $compile(html);
                    var imageElem = linkingFunction(scope);

// Might be useful for a progress bar.
// But is not called if the image is cached by the browser.
                    imageElem.bind("load", function() {

                    //    alert("image is loaded");

                    });

 // Add the image element.
                    $(element).append(imageElem);

                });


            }
        };
    });



    /****************************************************************************
     *
     * Create a dynamic captcha element.
     *
     ****************************************************************************/


    searchDirectives.directive("kCaptcha", function($compile) {

        return {

            restrict: "A",

            link: function(scope, element, attrs) {


// Called when the image value changes.
                attrs.$observe('kCaptcha', function(val) {

// Remove any pre-existing child (captcha) elements.
                    $(element).children().remove( );

// Create the new element
                    var html = "<div id='k-barcode-captcha'></div>";
                    var linkingFunction = $compile(html);
                    var imageElem = linkingFunction(scope);

// Add the captcha div element.
                    $(element).append(imageElem);
// Convert to a captcha
                    authenticate.k_renderCaptcha("k-barcode-captcha");

                });


            }
        };
    });



})(window, window.angular);
