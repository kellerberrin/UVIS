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
 
    // Search on drug NDC only 
    function tableSearch(event) {
        // Get values from the search form elements on the page:
        var SearchString = $("#id-string").val();
        // Send the data using JQuery post
        k_postForm("#k-display-results", event, "/searchdb", { "searchstring": SearchString, "searchtype": "ndc" } )
    }
    // Search on drug name only.
    function nameSearch(event) {
        var SearchString = $("#name-string").val();
        // Send the data using JQuery post
        k_postForm("#k-display-results",event, "/searchdb", { "searchstring": SearchString, "searchtype": "name" } )
    }

    function k_postAngularSearch(Text, Type) {
        // Get values from the search form elements on the page:
        var SearchObj = k_validateSearchInput(Text, Type);
        // Send the data using JQuery post
        
        if (SearchObj != null) {
        
            k_postForm("#k-display-results", event, "/searchdb", SearchObj );
            return SearchObj.searchstring;
    
        }

        return "";
    
    }

/*********************************************************************************************
*
*
* Validate the Search Input and Popup dialogs as needed.
*
*
************************************************************************************************/

// The dialog box callbacks.

    function k_YesNameCallback(Event) {
    
//        $("#k-select-search-type").data().RadioButtons().k_RadioSetSelection("name");    
        k_postForm("#k-display-results", event, "/searchdb", k_unvalidatedSearchValues());        
    }

    function k_YesNDCCallback(Event) {
    
///        $("#k-select-search-type").data().RadioButtons().k_RadioSetSelection("ndc");    
        k_postForm("#k-display-results", event, "/searchdb", k_unvalidatedSearchValues());        
    }

    function k_YesLengthCallback(Event) {
    
    }

    function k_NoCallback(Event) {  // No validation logic required.
    
        k_postForm("#k-display-results", event, "/searchdb", k_unvalidatedSearchValues());        
    
    }

// Validate input.

    function k_validateSearchInput(SearchString, SearchType) {
    
        var HelpText;
        
        var SearchLength = SearchString.length;
        
        var DigitArray = SearchString.match(/[0-9]/g);
        
        var DigitLength = (DigitArray != null) ? DigitArray.length : 0;
                    
        if (SearchType == "name") {

            if (SearchLength == 0) {

                SearchString = "Livalo";
//                $("#k-search-string").val(SearchString);                        

            } else if ((2 * DigitLength) > SearchLength) {
            
                HelpText = "The text entered; " + "'" + SearchString + "' " 
                         + "looks like a National Drug Code (NDC). Do you want to search 'By Code'?";
//                k_modalYesNo(HelpText, k_YesNDCCallback, k_NoCallback);
                return null;
            }
        
        } else if (SearchType  == "ndc") {
        
            if (SearchLength == 0) {

                SearchString = "0002-4770-90";
//                $("#k-search-string").val(SearchString);

            }                        
            else if ((2 * DigitLength) <= SearchLength) {
            
                HelpText = "The text entered; " + "'" + SearchString + "' " 
                         + "looks like a drug name. Do you want to search 'By Name'?";
//                k_modalYesNo(HelpText, k_YesNameCallback, k_NoCallback);
                return null;                        

            }
            else if (DigitLength != 10) {
            
                HelpText = "The text entered; " + "'" + SearchString + "' " + " has " + DigitLength + " digits." 
                           + " Most National Drug Codes (NDC) are 10 digits long. Do you want to continue the search?";
//                k_modalYesNo(HelpText, k_YesLengthCallback, k_NoCallback);
                return null;                        
                        
            }

        } else if (SearchType == "active") {
        
            if (SearchLength == 0)
            {
                SearchString = "Pitavastatin";
//                $("#k-search-string").val(SearchString);                        
            }
            else if ((2 * DigitLength) > SearchLength) {
            
                HelpText = "The text entered; " + "'" + SearchString + "' " 
                         + "looks like a National Drug Code (NDC). Do you want to search 'By Code'?";
//                k_modalYesNo(HelpText, k_YesNDCCallback, k_NoCallback);
                return null;                        
            }

        } else {
        
            k_consoleLog("unknown search type in k_validateSearchInput()");
        
        }

        return { "searchstring": SearchString, "searchtype": SearchType };

    }


/*********************************************************************************************
*
*
* Drug modal dialog object.
*
*
************************************************************************************************/


    function k_modalTextOnly(ModalText)
    {
        var Dialog = $("#k-drug-modal").data();
        Dialog.k_DialogText(ModalText);
        Dialog.k_DialogActive();
        $("#k-drug-modal").data(Dialog);

    }
    function k_modalYesNo(ModalText, YesCallback, NoCallback)
    {
        var Dialog = $("#k-drug-modal").data();
        Dialog.k_DialogText(ModalText);
        Dialog.k_Button_1_Visible("Yes", YesCallback);        
        Dialog.k_Button_2_Visible("No", NoCallback); 
        Dialog.k_CancelCallback(NoCallback);                       
        Dialog.k_DialogActive();
        $("#k-drug-modal").data(Dialog);

    }


/*********************************************************************************************
*
*
* Toggle the results as collapsed or expanded.
*
*
************************************************************************************************/

    function k_expandAll() {
    
        // Toggle between expanded and collpased.

        if ($("#k-expansion-button").is(".k-collapsed")) {
                
            $("#k-expansion-button").removeClass("k-collapsed");
        
        } else {
        

            $("#k-expansion-button").addClass("k-collapsed");
        
        }
    
    }

/*********************************************************************************************
*
*
* Set up record count in the notification area.
* If more than 1 result then display as collapsed.
*
*
************************************************************************************************/

    function k_drugCount(ResultsId, DrugCount) {
            
        var DrugCountString;
        var MaxDrugCount = 100;
            
        if (DrugCount > 1) {
                            
            $(ResultsId).addClass("k-active-results");
            $("#k-expansion-button").addClass("k-collapsed");            

            if (DrugCount == MaxDrugCount) {
            
                DrugCountString =  "Search found (max) " + DrugCount + " drugs.";
            
            } else {
            
                DrugCountString =  "Search found " + DrugCount + " drugs.";
            
            }
                
        } else  if (DrugCount == 1) {
            
            DrugCountString = "Search found 1 drug."
            $(ResultsId).addClass("k-active-results");            
            $(ResultsId + " #k-expansion-button").removeClass("k-collapsed");            
            
        } else {
            
            DrugCountString = "No matching drugs."
            $(ResultsId).removeClass("k-active-results");            
            $("#k-expansion-button").removeClass("k-collapsed");                        
        }            
            
        $("#k-notification-area").text(DrugCountString);
                       
    }



/*********************************************************************************************
*
*
* Set up the returned AJAX results.
* Called at the bottom of the AJAX html.
*
*
************************************************************************************************/

    function k_initializeResults(ResultsId, DrugCount ) {
    
        k_drugCount(ResultsId, DrugCount);
    
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


