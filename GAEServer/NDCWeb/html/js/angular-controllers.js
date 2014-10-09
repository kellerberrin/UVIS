"use strict";

/* Controllers */

var USDrugControllers = angular.module("USDrugControllers", []);

    USDrugControllers.controller("DrugSearchCtrl",
        [ "$scope"
        , "$materialToast"
        , "USDrugDatabase"
        , "USDrugEndPoints"
        , function DrugSearchCtrl($scope, $materialToast, USDrugDatabase, USDrugEndPoints) {

            $scope.view = {};
            $scope.model = {};

            $scope.view.searchtype = new k_DropDown($("#k-searchtype-dropdown"));
                
            $scope.model.search  =  { text: ""
                                    , type : "name"
                                    , typelist : [ "name", "active", "ndc"]
                                    , textpromptlist : ["name","active","ndc"]  };

            $scope.model.search.prompt = $scope.model.search.textpromptlist[0];

                
            $scope.performSearch = function() {

                $scope.model.search.text = k_postAngularSearch($scope.model.search.text, $scope.model.search.type);
                $scope.requestTime = Date.now();
                var searchParams = {searchstring : $scope.model.search.text , searchtype : $scope.model.search.type};
                USDrugEndPoints.typeSearch(searchParams, function(data) {
                    $scope.resultTime = Date.now();
                    $scope.requestResults = data;
                    $scope.resultToast();
                });

            };

            $scope.updateType = function() {

                $scope.model.search.type = $scope.model.search.typelist[$scope.view.searchtype.getIndex()];

            };
 
            $scope.resultToast = function() {

                var ToastText =  "Search found " + $scope.requestResults.NDCEnhancedArraySize + " drugs "
                                 + "(" + (($scope.resultTime - $scope.requestTime) / 1000) + " secs)";

                var ToastOptions = { template: "<material-toast>" + ToastText + "</material-toast>", duration: 3000 };

                $materialToast.show(ToastOptions);

            }


        }]);

