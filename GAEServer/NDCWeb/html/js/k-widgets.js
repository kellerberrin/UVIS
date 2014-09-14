/* 
*
* Copyright Kellerberrin 2014.
*
* Library functions for use in Kellerberrin projects.
* and JS functions for the k-widgets.scss Kellerberrin widgets SASS file.
*
* Include in the 
*/


// Ensures that logging is available and logs to debug console. 
    function k_consoleLog(LogArgs) {
        if (window.console && console.log) {
                console.log(LogArgs);
            }        
    }

// A useful logging tool for a javascript object. Usage: insert between object and method "Obj.k_log().method(Args)".
    $.fn.k_log = function() {
        k-consoleLog(this);
        return this;
    }


// Render the entire document.

    function k_reRenderDocument(DocumentHTML) {
        document.open("text/html","replace");
        document.write(DocumentHTML);
        document.close();        
    }

// Render returned HTML from a database request.
// Deletes any existing HTML objects and then
// appends between <div id="display-results>ResultsHTML</div>.
// *** BUG -alert! *** $("#display-results").empty();
// produced undefined function errors when deleting 
// children from the DOM (why!).

    function k_renderResults(ResultsHTML) {

        $(document).ready(function() { $("#display-results").children().remove(); });        
        $(document).ready(function() { $("#display-results").append(ResultsHTML); });
    }

// Post from data and render the results.

    function k_postForm(event, URL, DataObj) {
        // Stop form from submitting normally
        event.preventDefault();    
        // Send the data using JQuery post
        var posting = $.post(URL, DataObj );
        // Render the returned html.
        posting.done(k_renderResults);
    }

// Implement a wait cursor during Ajax calls.
// This is called at initalization time.



    function startAnimation() {
    
        $("body").addClass("loading");

    }
    
    function stopAnimation() {
    
       $("body").removeClass("loading"); 

    }

// This uses the Ajax prefilter callbacks and is robust if there is a
// Jquery back-end error (unlike the start-stop technique).
//

    function initializePrefilterWaitCursor()
    {
        $.ajaxPrefilter(function( options, _, jqXHR ) {
                            startAnimation();
                            jqXHR.always( stopAnimation );
                        });                                  
    }

// The AJAX start/stop technique this fails if there is an error handling the
// request. The wait state does not disappear.

    function ajaxStartHandler(Event) {
     
        startAnimation();
        
    }
    
    function ajaxStopHandler(Event) {
     
        stopAnimation();
        
    }    

    function initializeAjaxStartStop()
    {
        $(document).on({ ajaxStart: ajaxStartHandler   
                       , ajaxStop: ajaxStopHandler 
                       , ajaxError: ajaxStopHandler});
    }

// Initalization currently uses the pre-filter technique. 

    function k_initializeWaitCursor()
    {
        initializePrefilterWaitCursor();
    }

//**************************Accordian ************************************************************************* 
//
//
// Example HTML declaration:
/*
<div id="expand-menu" class="k-accordion k-unique"> <!-- Declares the k-accordion, "k-unique" means only one expanded section open at a time.
		<div class="k-header">Home</div>              <!- Accordion header --> 
		<div class="k-expander k-expanded">Products</div> <!-- Expand button, "k-expanded" initially expands the selection. -->
	    <div class="k-expandable">     <!-- The k-exandable section, must be the next sibling to the k-expander class -->
		    <div>Widgets</div>      <!-- Sub-menu items that are initially expanded -->
			<div>Menus</div>
		    <div>Products</div>
		</div>
		<div class="k-expander">Company</div>
		<div class="k-expandable">
		    <div>About</div>
			<a href="#">Location</a>
		</div>
		<div class="k-static">Contact</div> <!-- Non-expandable sibling menu item. -->
</div> <!-- k-accordion -->
<script>$(document).ready(function() { k_InitializeAccordian("expand-menu"); });</script> <!-- Must be initialized -->
*/

    function k_InitializeAccordian(MenuId) {

        var MenuSelector = MenuId; // A valid JQuery selector string

        var Expanders = $(MenuSelector + " .k-expander");
        
        // If the class "k-expander k-expanded" is not set then class is "u-collapsed" 
        Expanders.not(".k-expanded").addClass("k-collapsed");   

        // Ensure the "k-expander k-collapsed" children are not visible.
        Expanders.not(".k-expanded").next().filter(".k-expandable").hide(); 

        // Show the "k-expander k-expanded" children.
        Expanders.filter(".k-expanded").next().filter(".k-expandable").show();  

        // All the "k-expander" have callbacks attached.
        Expanders.click(k_AccordionCallbackClosure(MenuSelector)); 
        
    }

    function k_AccordionCallbackClosure(MenuId) {

        var MenuSelector = MenuId;  // This var preserved as a closure.

        function AccordionCallback(Event) {
    
            Expanded = $(this).is(".k-expanded");   // Save the state of the active ".k-expander" 

            if ($(MenuSelector).is(".k-unique"))  // If the accordion has the "k-unique attribute, the close all open "k-expander".
            {
            
                $(MenuSelector + " .k-expander").removeClass("k-expanded");   // Remove the "k-expanded" class from all "k-expander".            
                $(MenuSelector + " .k-expander").addClass("k-collapsed");   // Add the "k-collpased" class.            
		        $(MenuSelector + " .k-expander").next().filter(".k-expandable").slideUp("normal");  // Slide up any adjacent expanable
            
            }

	        var Expandable = $(this).next().filter(".k-expandable"); // Get the adjacent expandable associated with the "k-expander".

	        if(Expanded) {  // Toggle the "k-expander" state.
		
		        $(this).removeClass("k-expanded");  // remove the "active" class from the "k-expand" class
		        $(this).addClass("k-collapsed");  // remove the "active" class from the "k-expand" class
		        Expandable.slideUp("normal"); // and slide up the expandable
	    
	        } else { // If the children are invisible

		        $(this).addClass("k-expanded");  // remove the "active" class from the "k-expand" class
		        $(this).removeClass("k-collapsed");  // remove the "active" class from the "k-expand" class
		        Expandable.slideDown("normal"); // and slide up the expandable

	        }

            Event.preventDefault(); // Prevent the click event from propagating further (returning false is deprecated).  	        
        
        }  // Accordion Callback
        
        return AccordionCallback;        

    }


/**************************Collapsible radio button ************************************************************************* 
*
* Example HTML declaration:
*
* Note that the value of data-select is returned for the selected radio button using the utility function k_RadioGetSelection()
* 
*
*   <div id="select-search-type" class="k-radio-group k-radio-expandable">  <!-- Declare the radio buttons group. Can be expandable (only selected shown)
*       <div class="k-radio-header">Search Type</div>                       <!-- The radio button header section (optional) -->
*	    <div class="k-radio k-selected" data-select="name">Drug Name</div>  <!-- The initially selected radio option -->
*	    <div class="k-radio" data-select="active">Drug Ingredients</div>    <!-- Another radio option (must be a sibling)
*	    <div class="k-radio"data-select="ndc">National Drug Code</div>      <!-- etc -->
*   </div>                                                      <!-- k-radio-button -->
*   <script>$(document).ready(function() { k_InitializeRadio("select-search-type"); });</script> <!-- Must be initialized -->
*/

    function k_InitializeRadio(RadioId) {

        var RadioSelector = RadioId; // A valid JQuery selector string

        var Selections = $(RadioSelector + " .k-radio");
        
        // All the "k-radio" have callbacks attached.
        Selections.click(k_RadioCallbackClosure(RadioSelector)); 
        
    }

    function k_RadioCallbackClosure(RadioId) {

        var RadioSelector = RadioId;  // This var preserved as a closure.

        function RadioCallback(Event) {
                
            // If already selected then toggle the .radio-group between collapsed and not collapsed.

            k_consoleLog(Event);

            if ($(this).is(".k-selected")) {
            
                if ($(RadioSelector).is(".k-collapsed")) {
                    
                    $(RadioSelector).removeClass("k-collapsed");
                    
                } else {
                
                    $(RadioSelector).addClass("k-collapsed");
                
                }   

            }

            $(RadioSelector + " .k-radio").removeClass("k-selected");  // remove the k-selected class from other selections. 
           
            $(this).addClass("k-selected");   // Set the selected state" 

            Event.preventDefault(); // Prevent the click event from propagating further (returning false is deprecated).  	        
        
        }  // Radio Callback
        
        return RadioCallback;        

    }

    // Convenience subroutine to retrieve the active selection. 

    function k_RadioGetSelection(RadioId) { // RadioId a valid JQuery selector string identifing the .k-radio-group 
    
        var Selections = $(RadioId + " .k-radio");

        var Selected = "no selection";  
        
        function k_radioIsSelected() { 

            if ( $( this ).is(".k-selected")) {
                
                Selected = $( this ).data("select");
                return false; // no need to look further 
            
            }
            
            return true;
            
        }      

        $(Selections).each(k_radioIsSelected);
 
        return Selected;

    }       
    
        


