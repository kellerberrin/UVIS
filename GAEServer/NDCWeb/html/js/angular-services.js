"use strict";

/* Services */

var USDrugServices = angular.module("USDrugServices", ["ngResource"]);

    USDrugServices.factory("USDrugDatabase", ["$resource", function($resource){

        return $resource( "/searchdbjson"    //url

                        , {   }    // default arguments

                        , { searchdrugs: {method:"POST", params:{searchstring : "@searchstring" , searchtype : "@searchtype"} } }

        );

    }]);


    USDrugServices.factory("USDrugEndPoints", ["$resource", function($resource){

        return $resource( "/_ah/api/searchUSdrugs/v1/typeSearch"   //url

            , {   }    // default arguments

            , { typeSearch: { method: "POST", params: {searchstring: "@searchstring", searchtype: "@searchtype"}
                , transformResponse : function(data, dataHeaders) {

// Need to JSON de-serialize the object twice because of the Server End Points formatting (see library.py).
// This code looks fragile because it assumes the API response will be in a specific format.

                        if (typeof data == "string") {
                            var obj1 = angular.fromJson(data)
                            if (typeof obj1.resultMessage == "string") {
                                return angular.fromJson(obj1.resultMessage)
                            }
                            else {
                                return data;
                            }
                        }
                        else {
                            return data;
                        }
                    }
                }

            }
        );

    }]);


