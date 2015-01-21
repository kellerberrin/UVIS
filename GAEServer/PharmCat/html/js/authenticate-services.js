"use strict";

/*
 *
 * Copyright Kellerberrin 2014.
 * Non-Angular authenticate functionality.
 *
 */


var authenticate = (function (window, undefined) {


    var k_renderCaptcha = function () {

        utilityModule.k_consoleLog("Render Captcha");
        grecaptcha.render("k-barcode-captcha", {"sitekey": "6LcEZQATAAAAAM3csszGhzvXpShpq2Dwgz6QtVKW"});

    };

})(window);


/*
 *
 * Copyright Kellerberrin 2014.
 * Angular authenticate functionality.
 *
 */



(function (window, angular, undefined) {


    /* The Search Prompt */

    var authenticate = angular.module("kAuthenticate", ["ngResource"]);


    /*********************************************************************************************
     *
     * Communicate with the captcha authentication end-point.
     *
     *********************************************************************************************/


    authenticate.factory("VerifyCaptcha", ["AppConfig", "$resource", function (AppConfig, $resource) {

        return $resource(AppConfig.captchaURL()   //url

            , {}    // default arguments

            , {
                typeSearch: {
                    method: "POST"
                    , params: {promptstring: "@promptstring", prompttype: "@prompttype", promptsize: "@promptsize"}
                    , transformResponse: function (jsonData, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.

                        obj2 = {};
                        if (typeof jsonData == "string") {
                            var obj1 = angular.fromJson(jsonData);
                            if (typeof obj1.resultMessage == "string") {
                                var obj2 = angular.fromJson(obj1.resultMessage);
                            }
                        }
                        return {promptArray: obj2};
                    }
                }
            }
        );

    }]);



})(window, window.angular);















