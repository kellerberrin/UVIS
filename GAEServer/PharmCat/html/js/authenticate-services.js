"use strict";

/*
 *
 * Copyright Kellerberrin 2015.
 * Angular authenticate functionality.
 *
 */


/*********************************************************************************************
 *
 * Global (non angular) authentication routines.
 *
 *********************************************************************************************/


var globalAuthenticate = (function (window, angular, undefined) {


    var k_loadCaptcha = function(id) {

        // Fired when the page is loaded but we still need to wait for angular
        $( document ).ready(k_renderCaptcha(id));

    };


    var k_renderCaptcha = function (id) {

        var scope = undefined;

        var intervalId = setInterval(function() {   // Loop every 100ms until angular is loaded

            scope = angular.element($("#"+id)).scope();   // Redirect to the angular factory.

            if (scope != undefined) {

                scope.authenticate.renderCaptcha(id);

                scope.$apply();

                clearInterval(intervalId);

            }

        } , 100);

    };

    return { // Public methods.

        k_loadCaptcha: k_loadCaptcha

    };

})(window, window.angular);


/*********************************************************************************************
 *
 * Global angular authentication routines.
 * These objects contain the current authentication state and high level auth functionality.
 *
 *********************************************************************************************/


(function (window, angular, undefined) {


    var authenticate = angular.module("kAuthenticate", ["ngResource"]);


    authenticate.factory("Authenticate", [ "AppConfig",
                                            "$window",
                                            "CaptchaConfirm",
        function ( AppConfig,
                   $window,
                   CaptchaConfirm) {


            var captchaLoaded = false;
            var captchaResponse = null;
            var captchaParams = null;
            var verifyParams = null;
            var captchaWidget = null;

            var captchaCallback = function(response) {

                captchaResponse = response;
                angular.element($("#k-barcode-captcha")).scope().$apply();
                utilityModule.k_consoleLog(["Captcha Response", response]);

            };

            var captchaSessionConfirm = function() {

                verifyParams = {publickey: AppConfig.recaptchaPublicKey(), response: response, ipaddress: ""};

                CaptchaConfirm.captchaConfirm(verifyParams);


            };

            var captchaReset = function() {

                $window.grecaptcha.reset(captchaWidget);

            };

            var renderCaptcha = function (id) {

                captchaParams =  {sitekey: AppConfig.recaptchaPublicKey(), callback: captchaCallback };

                captchaWidget = $window.grecaptcha.render(id, captchaParams);   // The Google captcha initialization

                captchaLoaded = true;

            };

            var authReady = function() {

                return captchaLoaded;

            };

            var captchaStatus = function() {

                return captchaResponse != null;

            };

            return {

                authReady: authReady,

                renderCaptcha: renderCaptcha,

                captchaStatus: captchaStatus

            };

        }]);

    /*********************************************************************************************
     *
     * Communicate with the captcha authentication end-point.
     *
     *********************************************************************************************/

    authenticate.factory("CaptchaConfirm", [ "AppConfig",
                                             "CaptchaEndpoint",
                                             "SearchErrorDialog",
        function (AppConfig,
                  CaptchaEndPoint,
                  SearchErrorDialog) {

            var captchaConfirm = function (captchaParams) {

                utilityModule.k_consoleLog(captchaParams);

                CaptchaEndPoint.confirm(captchaParams,

                    function (data) {

                        utilityModule.k_consoleLog(["Captcha Response", data]);

                    },

                    function (error) {

                        SearchErrorDialog.displayError(error);
                        utilityModule.k_consoleLog(["Captcha EndPoints - error", error]);

                    }

                );

            };


            return {

                captchaConfirm: captchaConfirm

            };

        }]);


    authenticate.factory("CaptchaEndpoint", ["AppConfig", "$resource", function (AppConfig, $resource) {

        return $resource(AppConfig.captchaURL()   //url

            , {}    // default arguments

            , {
                confirm: {
                    method: "POST"
                    , params: {publickey: "@publickey", response: "@response", ipaddress: "@ipaddress"}
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
                        return {captchaConfirm : obj2};
                    }
                }
            }
        );

    }]);


})(window, window.angular);














