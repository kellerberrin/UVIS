/* 
 *
 * Copyright Kellerberrin 2014.
 *
 * Java script functions for the FDA drug database application.
 * The script 'DrugSearch.html' performs the inital search
 * The script 'DrugResults.html' uses JinJa to format the returned database results
 * These results are returned as an AJAX update. See these HTML files for usage and 'id=' definitions.
 *
 */


// Ensures that logging is available and logs to debug console.
function k_consoleLog(LogArgs) {
    if (window.console && console.log) {
        console.log(LogArgs);
    }
}

// todo:: remove this code.


function ingredientSubmit(Index, Ingredient, Strength, Units) {

    IngredientObj = { "Index": Index, "Ingredient": Ingredient, "Strength": Strength, "Units": Units };

    return (function () {
        k_consoleLog(IngredientObj);
    });

}


function ingredientSearch(event) {

    var ArgObj = {};

    // Get the number of search ingredients.
    var NumIngredients = $("#active-count").val();
    var IntNumIngredients = Number(NumIngredients);

    ArgObj["active-count"] = NumIngredients;

    var IndexStr = "";
    var ValStr = "";

    // Get the ingredient search arguments
    for (i = 1; i <= IntNumIngredients; i++) {

        IndexStr = "searchtype-" + i.toString();
        ValStr = $("#" + IndexStr).val();
        ArgObj[IndexStr] = ValStr;

        IndexStr = "ingredient-" + i.toString();
        ValStr = $("#" + IndexStr).val();
        ArgObj[IndexStr] = ValStr;

        IndexStr = "strength-" + i.toString();
        ValStr = $("#" + IndexStr).val();
        ArgObj[IndexStr] = ValStr;

        IndexStr = "units-" + i.toString();
        ValStr = $("#" + IndexStr).val();
        ArgObj[IndexStr] = ValStr;
    }

    k_consoleLog(ArgObj);

    postForm(event, "/searchingredients", ArgObj)
}

// JQ plugin to store ingredient data as an array of objects in a form.
// { Ingredient : "IngredientValue", Strength : "StrengthValue", Units :  "UnitValue" }
// Place inside the JinJa ingredient loop.
// Use: <script>$("#form-id").addIngredient("Ingredient", "Strength", "Unit");</script>

(function ($) {

    $.fn.addIngredient = function (IngredientStr, StrengthStr, UnitStr) {

        var IngredientArrayObj = $(this).data("IngredientArray");

        if (IngredientArrayObj == undefined) {

            $(this).data({ IngredientArray: [] });  // If the data object is undefined then create it.

            IngredientArrayObj = $(this).data();

        }

        var IngredientObj = { Ingredient: IngredientStr, Strength: StrengthStr, Unit: UnitStr };

        IngredientArrayObj.IngredientArray.push(IngredientObj);

    }; // addIngredient function.

})(jQuery); // Define as a JQ plugin.

// JQ plugin to get the ingredient data as an array of ingredient objects.
// Use: <script>$var IngredientArray = ("#form-id").getIngredient();</script>

(function ($) {

    $.fn.getIngredient = function () {

        var IngredientArray = $(this).data("IngredientArray");

        if (IngredientArray == undefined) {

            return [];  // If the data object is undefined then return the empty list

        }

        return IngredientArray;

    }; // getIngredient function.

})(jQuery); // Define as a JQ plugin.


// JQ plugin to submit ingredient forms.

(function ($) {

    $.fn.autosubmit = function () {

        this.submit(function (event) {
            var form = $(this);
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize()
            }).done(function () {
                // Optionally alert the user of success here...
            }).fail(function () {
                // Optionally alert the user of an error here...
            }); // ajax call
            event.preventDefault();
        });  // The event function
    } // The autosubmit function
})(jQuery); // Define as a JQ plugin.

// Add a 'data-autosubmit' tag to the form and then set the property by calling:
// 
// $(function() { $('form[data-autosubmit]').autosubmit(); });
//


/*********************************************************************************************
 *
 *
 * Set up record count text in the notification area.
 *
 *
 ************************************************************************************************/

function k_drugCount(DrugCount, milliseconds) {

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

    DrugCountString = DrugCountString + " (" + (milliseconds / 1000) + " secs)";

    return DrugCountString;

}


/*********************************************************************************************
 *
 *
 * Define the standard data structures used on the client side.
 * Convert from the returned JSON structure to the client structure.
 *
 *
 ************************************************************************************************/


function k_clientDrugData() {

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
            drugRecord.ndc9 = NDCRecord.hasOwnProperty("ninedigitndc") ? NDCRecord.ninedigitndc : "";
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

                            var activeRecord = {};

                            activeRecord.activeName = NDCRecord.substancelist[j];
                            activeRecord.activeselected = true;
                            activeRecord.strength = NDCRecord.activenumeratorstrength[j];
                            activeRecord.strengthselected = true;
                            activeRecord.units = NDCRecord.activeingredientunit[j];

                            drugRecord.activeArray.push(activeRecord);

                        }

                    }
                    else { // fail gracefully

                        k_consoleLog({ errormessage: "Invalid Active Ingredients", data: endPointData});

                    }

                }
                else {

                    k_consoleLog({ errormessage: "Invalid Active Ingredients", data: endPointData});

                }


            }

            this.drugDataArray.push(drugRecord);

        }

    }

}


function k_NDC9SearchArray(Record) {

    NDC9SearchString = Record.ndc9

    if (Record.ndc9ImageArray instanceof Array) {

        for (var j = 0; j < Record.ndc9ImageArray.length; j++) {


            NDC9SearchString += "," + Record.ndc9ImageArray

        }

    }

    return NDC9SearchString;

}

