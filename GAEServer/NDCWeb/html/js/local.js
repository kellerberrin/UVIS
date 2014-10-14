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



// Store the parameters for an ingredient search.

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
* Set up record count in the notification area.
* If more than 1 result then display as collapsed.
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
* Initialization - called at the bottom of the HTML body.
*
*
************************************************************************************************/

    function k_localInitialization() {
        //   Any general page/form initialization here.
        setSearchType("name");  // Setup the 'active' search option.
        k_initializeWaitCursor(); // Setup the wait cursor
    }


