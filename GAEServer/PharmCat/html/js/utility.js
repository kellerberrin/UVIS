/* 
 *
 * Copyright Kellerberrin 2014.
 *
 */

"use strict";


var utilityModule = (function (window, angular, undefined) {

    /*********************************************************************************************
     *
     *
     * Ensures that logging is available and logs to debug console.
     *
     *
     ************************************************************************************************/

    var k_consoleLog = function (LogArgs) {

        if (window.console && console.log) {
            console.log(LogArgs);
        }

    };


    /*********************************************************************************************
     *
     *
     * Capitalize the first letter of a string.
     *
     *
     ************************************************************************************************/

    var k_capitalize = function(string) {

        if (typeof string == "string" && string.length > 0) {

            return string.charAt(0).toUpperCase() + string.slice(1);

        } else {

            return string;

        }

    };

    /*********************************************************************************************
     *
     *
     * Set up record count text in the notification area.
     *
     *
     ************************************************************************************************/

    var k_drugCount = function (DrugCount, milliseconds) {

        var DrugCountString;
        var MaxDrugCount = 100;

        if (DrugCount > 1) {

            if (DrugCount == MaxDrugCount) {

                DrugCountString = "Search found (max) " + DrugCount + " drugs.";

            } else {

                DrugCountString = "Search found " + DrugCount + " drugs.";

            }

        } else if (DrugCount == 1) {

            DrugCountString = "Search found 1 drug.";

        } else {

            DrugCountString = "No matching drugs.";
        }

        if (milliseconds >= 0 ) {

            DrugCountString = DrugCountString + " (" + (milliseconds / 1000) + " secs)";

        } else {


            DrugCountString = DrugCountString + " (cache)";

        }

        return DrugCountString;

    };


    /*********************************************************************************************
     *
     * Define the standard data structures used on the client side.
     * Convert from the returned JSON structure to the client structure.
     *
     ************************************************************************************************/


    var k_clientDrugData = function () {

        this.drugDataArray = [];

        this.parseJsonData = function (endPointData) {


            for (var i = 0; i < endPointData.NDCRecordArray.length; i++) {

                var drugRecord = {}; // Beware the dreaded deep copy bug.
                var NDCRecord = endPointData.NDCRecordArray[i];

                drugRecord.ndc = NDCRecord.hasOwnProperty("ndc") ? NDCRecord.ndc : "";
                drugRecord.name = NDCRecord.hasOwnProperty("proprietaryname") ? NDCRecord.proprietaryname : "";
                drugRecord.labeler = NDCRecord.hasOwnProperty("labellername") ? NDCRecord.labellername : "";
                drugRecord.dosage = NDCRecord.hasOwnProperty("dosageformname") ? NDCRecord.dosageformname : "";
                drugRecord.route = NDCRecord.hasOwnProperty("routename") ? NDCRecord.routename : "";
                drugRecord.package = NDCRecord.hasOwnProperty("packagedescription") ? NDCRecord.packagedescription : "";
                drugRecord.format = NDCRecord.hasOwnProperty("format") ? NDCRecord.format : "";
                drugRecord.smallimageurl = NDCRecord.hasOwnProperty("smallimageurl") ? NDCRecord.smallimageurl : "";
                drugRecord.largeimageurl = NDCRecord.hasOwnProperty("largeimageurl") ? NDCRecord.largeimageurl : "";
                drugRecord.ndc9 = k_NDC9Format(NDCRecord.hasOwnProperty("ninedigitndc") ? NDCRecord.ninedigitndc : "");
                drugRecord.ndc11 = k_NDC11Format(NDCRecord.hasOwnProperty("ndcelevendigit") ? NDCRecord.ndcelevendigit : "");
                drugRecord.ndc11package = k_NDC11PackageSuffix(NDCRecord.hasOwnProperty("ndcelevendigit") ? NDCRecord.ndcelevendigit : "");
                drugRecord.hasimage = (drugRecord.smallimageurl != "");  // Set to true if drug images exist.

                var ndc9ImageStringArray = NDCRecord.hasOwnProperty("ndcnineimagecodes") ? NDCRecord.ndcnineimagecodes : "";
                drugRecord.ndc9ImageArray = [];
                if (ndc9ImageStringArray instanceof Array) {

                    for (var j = 0; j < ndc9ImageStringArray.length; j++) {

                        if (ndc9ImageStringArray[j].length == 9) {

                            drugRecord.ndc9ImageArray.push(ndc9ImageStringArray[j]);

                        }

                    }

                }

                drugRecord.activeArray = [];

                if (NDCRecord.hasOwnProperty("substancelist")
                    && NDCRecord.hasOwnProperty("activenumeratorstrength")
                    && NDCRecord.hasOwnProperty("activeingredientunit")) {

                    if (NDCRecord.substancelist instanceof Array
                        && NDCRecord.activenumeratorstrength instanceof Array
                        && NDCRecord.activeingredientunit instanceof Array) {

                        if ((NDCRecord.substancelist.length == NDCRecord.activenumeratorstrength.length)
                            || (NDCRecord.substancelist.length == NDCRecord.activeingredientunit.length)) {

                            for (var j = 0; j < NDCRecord.substancelist.length; j++) {

                                if (NDCRecord.substancelist[j].length > 0) {

                                    var activeRecord = {};

                                    activeRecord.activeName = NDCRecord.substancelist[j];
                                    activeRecord.activeselected = true;
                                    activeRecord.strength = NDCRecord.activenumeratorstrength[j];
                                    activeRecord.strengthselected = true;
                                    activeRecord.units = NDCRecord.activeingredientunit[j];

                                    drugRecord.activeArray.push(activeRecord);

                                }

                            }

                        }
                        else { // fail gracefully

                            k_consoleLog({errormessage: "Invalid Active Ingredients", data: endPointData});

                        }

                    }
                    else {

                        k_consoleLog({errormessage: "Invalid Active Ingredients", data: endPointData});

                    }


                }

                drugRecord.hasActive = (drugRecord.activeArray.length > 0);

                this.drugDataArray.push(drugRecord);

            }

        }

    };

    /*********************************************************************************************
     *
     *  Routines to manipulate NDC codes.
     *
     ************************************************************************************************/

    var k_NDC9SearchArray = function (Record) {

        var NDC9SearchString = Record.ndc9;

        if (Record.ndc9ImageArray instanceof Array) {

            for (var j = 0; j < Record.ndc9ImageArray.length; j++) {


                NDC9SearchString += "," + Record.ndc9ImageArray;

            }

        }

        return NDC9SearchString;

    };

    var k_NDC11PackageSuffix = function (NDC11Code) {

        return NDC11Code.substring(9);

    };


    var k_NDC11Format = function (NDC11Code) {

        if (NDC11Code.length != 11) {

            return NDC11Code;

        }

        var FormattedNDC11 = k_NDC9Format(NDC11Code.substring(0, 9)) + "-" + k_NDC11PackageSuffix(NDC11Code);

        return FormattedNDC11;

    };


    var k_NDC9Format = function (NDC9Code) {

        if (NDC9Code.length != 9) {

            return NDC9Code;

        }

        var FormattedNDC9 = NDC9Code.substring(0, 5) + "-" + NDC9Code.substring(5);

        return FormattedNDC9;

    };

    /*********************************************************************************************
     *
     *
     * Make the Utility routines public.
     *
     ************************************************************************************************/

    return { // Public methods.

        k_consoleLog: k_consoleLog,

        k_drugCount: k_drugCount,

        k_clientDrugData: k_clientDrugData,

        k_NDC9SearchArray: k_NDC9SearchArray,

        k_NDC9Format: k_NDC9Format,

        k_capitalize: k_capitalize

    };

})(window, window.angular);
