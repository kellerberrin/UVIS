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


// Set the focus to search text input      
    function resetInputFocus() {
        $("#search-string").focus();                
    }

// Set the search type using Foundation tab buttons.

    function setSearchType(SearchType) {
        var TabId = "#" + SearchType + "-tab";  // Construct the Tab Id string
        var PromptId = "#" + SearchType + "-prompt"; // Construct the Prompt Id String   
        $(TabId).addClass("active");   // Set the named search tab-title to active. 
        $(PromptId).addClass("active");   // Set the named search prompt to active.
        resetInputFocus();
    }

// Set the drop down ingredient search button.

    function setIngredientSearch(SearchType) {
    
        var NewSearchHTML = SearchType + "<span data-dropdown='droplist'></span>";

        $('#submit-i').html(NewSearchHTML); 
 
    }

// Store the parameters for an ingredient search.

    function ingredientSubmit(Index, Ingredient, Strength, Units) {

        IngredientObj = { "Index" : Index , "Ingredient" : Ingredient, "Strength" : Strength, "Units" :  Units };
        
        return (function() { consoleLog(IngredientObj); });    

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
 
    // Search on drug NDC only 
    function tableSearch(event) {
        // Get values from the search form elements on the page:
        var SearchString = $("#id-string").val();
        // Send the data using JQuery post
        k_postForm(event, "/searchdb", { "searchstring": SearchString, "searchtype": "ndc" } )
    }
    // Search on drug name only.
    function nameSearch(event) {
        var SearchString = $("#name-string").val();
        // Send the data using JQuery post
        k_postForm(event, "/searchdb", { "searchstring": SearchString, "searchtype": "name" } )
    }

    function postSearch(event) {
        // Get values from the search form elements on the page:
        var SearchType = k_RadioGetSelection("#select-search-type");
        var SearchString = $("#search-string").val();
        // Send the data using JQuery post
        k_postForm(event, "/searchdb", { "searchstring": SearchString, "searchtype": SearchType } )
    }

    function localInitialization() {
        //   Any general page/form initialization here.
        setSearchType("name");  // Setup the 'active' search option.
        k_initializeWaitCursor(); // Setup the wait cursor
    }


