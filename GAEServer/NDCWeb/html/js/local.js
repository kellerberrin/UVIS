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

        IngredientObj = { "Index" : Index , "Ingredient" : Ingredient, "Strength" : Strength, "Units" :  Units };
        
        return (function() { k_consoleLog(IngredientObj); });    

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
            ValStr = $("#"+IndexStr).val();
            ArgObj[IndexStr] = ValStr;
                
            IndexStr = "ingredient-" + i.toString();
            ValStr = $("#"+IndexStr).val();
            ArgObj[IndexStr] = ValStr;

            IndexStr = "strength-" + i.toString();
            ValStr = $("#"+IndexStr).val();
            ArgObj[IndexStr] = ValStr;
                
            IndexStr = "units-" + i.toString();
            ValStr = $("#"+IndexStr).val();
            ArgObj[IndexStr] = ValStr;
        }
            
        k_consoleLog(ArgObj);

        postForm(event, "/searchingredients", ArgObj)
    }

// JQ plugin to store ingredient data as an array of objects in a form.
// { Ingredient : "IngredientValue", Strength : "StrengthValue", Units :  "UnitValue" }
// Place inside the JinJa ingredient loop.
// Use: <script>$("#form-id").addIngredient("Ingredient", "Strength", "Unit");</script>

    (function($) {
  
        $.fn.addIngredient = function(IngredientStr, StrengthStr, UnitStr) {
 
                                var IngredientArrayObj = $(this).data("IngredientArray");
                                
                                if (IngredientArrayObj == undefined) {
                                
                                    $(this).data( { IngredientArray : [] } );  // If the data object is undefined then create it.

                                    IngredientArrayObj = $(this).data();                                     
                                
                                }  
 
                                var IngredientObj = { Ingredient : IngredientStr, Strength : StrengthStr, Unit :  UnitStr };
    
                                IngredientArrayObj.IngredientArray.push(IngredientObj);

                            }; // addIngredient function.    
    
    })(jQuery); // Define as a JQ plugin.

// JQ plugin to get the ingredient data as an array of ingredient objects.
// Use: <script>$var IngredientArray = ("#form-id").getIngredient();</script>

    (function($) {
  
        $.fn.getIngredient = function() {
 
                                var IngredientArray = $(this).data("IngredientArray");
                                
                                if (IngredientArray == undefined) {
                                
                                    return [];  // If the data object is undefined then return the empty list
                                
                                }  
     
                                return IngredientArray;
                                                                
                            }; // getIngredient function.    
    
    })(jQuery); // Define as a JQ plugin.



// JQ plugin to submit ingredient forms.

    (function($) {
  
        $.fn.autosubmit = function() {
    
                            this.submit(function(event) {
                            var form = $(this);
                            $.ajax({
                            type: form.attr('method'),
                            url: form.attr('action'),
                            data: form.serialize()
                            }).done(function() {
                                // Optionally alert the user of success here...
                            }).fail(function() {
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
            
                DrugCountString =  "Search found (max) " + DrugCount + " drugs.";
            
            } else {
            
                DrugCountString =  "Search found " + DrugCount + " drugs.";
            
            }
                
        } else  if (DrugCount == 1) {
            
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


function k_clientDrugData()
{

    this.drugDataArray = [];

    this.parseJsonData = function(endPointData) {


        for (var i = 0; i< endPointData.NDCEnhancedArray.length; i++) {

            var drugRecord = {}; // Beware the dreaded deep copy bug.
            var ndcEnhanced = endPointData.NDCEnhancedArray[i];

            k_consoleLog(ndcEnhanced)

            drugRecord.ndc = ndcEnhanced.hasOwnProperty("ndc") ? ndcEnhanced.ndc : "";
            drugRecord.name = ndcEnhanced.hasOwnProperty("proprietaryname") ? ndcEnhanced.proprietaryname : "";
            drugRecord.labeler = ndcEnhanced.hasOwnProperty("labellername") ? ndcEnhanced.labellername : "";
            drugRecord.dosage = ndcEnhanced.hasOwnProperty("dosageformname") ? ndcEnhanced.dosageformname : "";
            drugRecord.route = ndcEnhanced.hasOwnProperty("routename") ? ndcEnhanced.routename : "";
            drugRecord.package = ndcEnhanced.hasOwnProperty("packagedescription") ? ndcEnhanced.packagedescription : "";
            drugRecord.format = ndcEnhanced.hasOwnProperty("format") ? ndcEnhanced.format : "";
            drugRecord.smallimageurl = ndcEnhanced.hasOwnProperty("smallimageurl") ? ndcEnhanced.smallimageurl : "";
            drugRecord.largeimageurl = ndcEnhanced.hasOwnProperty("largeimageurl") ? ndcEnhanced.largeimageurl : "";
            drugRecord.hasimage = (drugRecord.smallimageurl != "");  // Set to true if drug images exist.

            drugRecord.activeArray = [];

            if (ndcEnhanced.hasOwnProperty("ActiveList")) {

                if (ndcEnhanced.ActiveList instanceof Array) {

                    for (var j = 0; j < ndcEnhanced.ActiveList.length; j++) {

                        var active = ndcEnhanced.ActiveList[j];
                        var activeRecord = {};

                        if (active instanceof Array) {

                            activeRecord.activeName = active[0];
                            activeRecord.strength = active[1];
                            activeRecord.units = active[2];

                            drugRecord.activeArray.push(activeRecord);

                        }

                    }

                }

            }

            this.drugDataArray.push(drugRecord);

        }

    }

}


