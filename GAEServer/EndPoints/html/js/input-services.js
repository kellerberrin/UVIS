"use strict";


(function (window, angular, undefined) {


    /* Services */

    var drugSearchServices = angular.module("kInputServices", []);


    drugSearchServices.factory("ValidateInput", [function () {

        function Validate(searchParams, success, failure) {

            var SearchType = searchParams.searchtype;
            var SearchString = searchParams.searchstring;

            var HelpText;

            var SearchLength = SearchString.length;

            var DigitArray = SearchString.match(/[0-9]/g);

            var DigitLength = (DigitArray != null) ? DigitArray.length : 0;

            if (SearchType == "name") {

                if (SearchLength == 0) {

                    SearchString = "Livalo";

                } else if ((2 * DigitLength) > SearchLength) {

                    HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Modify to search by 'Code (NDC)'?";
                    failure({searchstring: SearchString, searchtype: "ndc"}, HelpText);
                    return;
                }

            } else if (SearchType == "ndc") {

                if (SearchLength == 0) {

                    SearchString = "0002-4770-90";

                }
                else if ((2 * DigitLength) <= SearchLength) {

                    HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a drug name. Modify to search by 'Name'?";
                    failure({searchstring: SearchString, searchtype: "name"}, HelpText);
                    return;
                }
                else if (DigitLength != 10 && DigitLength != 9 && DigitLength != 11) {

                    HelpText = "The text entered; " + "'" + SearchString + "' " + " has " + DigitLength + " digits."
                    + " Most National Drug Codes are 11 (NDC11) or 10 (NDC10) or 9 (NDC9) digits long. Modify to search by 'Name'?";
                    failure({searchstring: SearchString, searchtype: "name"}, HelpText);
                    return;
                }

            } else if (SearchType == "active") {

                if (SearchLength == 0) {
                    SearchString = "Pitavastatin";
                }
                else if ((2 * DigitLength) > SearchLength) {

                    HelpText = "The text entered; " + "'" + SearchString + "' "
                    + "looks like a National Drug Code (NDC). Modify to search by 'Code (NDC)'?";
                    failure({searchstring: SearchString, searchtype: "ndc"}, HelpText);
                    return;
                }

            } else {

                utilityModule.k_consoleLog("unknown search type in USDrugValidateInput.Validate");

            }

            success({searchstring: SearchString, searchtype: SearchType});

        }

        return {Validate: Validate};

    }]);


    drugSearchServices.factory("InputSearchTypes", function () {


        var displayTypeArray = [];

        // Define the text input search types.

        var searchTypes = [
            {type: "name", typeprompt: "Name", defaulttext: "Livalo"},
            {type: "active", typeprompt: "Ingredient", defaulttext: "Pitavastatin"},
            {type: "ndc", typeprompt: "Code (NDC)", defaulttext: "0002-4772-90"},
            {type: "ingredient", typeprompt: "Ingredient (Extended+)", defaulttext: "Pitavastatin"},
            {type: "image", typeprompt: "Image Search (NDC9+)", defaulttext: "00002-4772"}
        ];

        var getdisplaytype = function (type) {  // Given a parameter search type, return the appropriate text input search type

            if (type == "name") {

                return searchTypes[0];

            } else if (type == "active") {

                return searchTypes[1];

            } else if (type == "ndc") {

                return searchTypes[2];

            } else if (type == "ingredient") {

                return searchTypes[3];

            } else if (type == "image") {

                return searchTypes[4];

            } else {  // Should not happen

                utilityModule.k_consoleLog("get display prompt - Badtype");
                return searchTypes[0];

            }

        };


        var getTypesArray = function () {

            displayTypeArray = [];

            for (var i = 0; i < searchTypes.length; i++) {

                if (textdisplaytype(searchTypes[i].type)) {

                    displayTypeArray.push(searchTypes[i]);

                }

            }

            return displayTypeArray;

        };

        var textdisplaytype = function (type) {  // Given a search type; check if this a text input search.

            return (type == "name" || type == "active" || type == "ndc");

        };


        return {

            getdisplaytype : getdisplaytype,

            getTypesArray : getTypesArray,

            textdisplaytype : textdisplaytype

        };

    });

})(window, window.angular);















