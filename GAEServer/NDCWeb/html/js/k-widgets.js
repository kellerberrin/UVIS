/* 
*
* Copyright Kellerberrin 2014.
*
* Library functions for use in Kellerberrin projects.
* and JS functions for the k-widgets.scss Kellerberrin widgets SASS file.
*
* Include in the HTML head section after JQuery. 
*/

// Convenience routine to set or unset element classes when the browser viewport is between some specified values.

    function k_setClassOnWindowSize(ElementId, ClassNames, UpperSize, LowerSize) {
    
        var cElementId = ElementId;   // The HTML element
        var cClassNames = ClassNames.split(",");   // comma delimited list of classes (no spaces).
        var cUpperSize = UpperSize;   // if -ve then infinitely big
        var cLowerSize = LowerSize;   // All variables use closure.
         
    // Check if the condition is already met.

        CurrentWidth = $(window).width();

        if (CurrentWidth >= cLowerSize && (cUpperSize < 0 || CurrentWidth <= cUpperSize)) {
        
            for ( var i = 0; i < cClassNames.length; i = i + 1 ) {
 
                if (!$(cElementId).is("." + cClassNames[i])) {
            
                    $(cElementId).addClass(cClassNames[i])
            
                }           
 
            }
        
        } 
        else {
        
            for ( var i = 0; i < cClassNames.length; i = i + 1 ) {
 
                if ($(cElementId).is("." + cClassNames[i])) {
            
                    $(cElementId).removeClass(cClassNames[i])
            
                }           
 
            }
                
        }

        function k_resizeCallback() {

            var WindowWidth = $(window).width();
                    
            if (WindowWidth >= cLowerSize && (cUpperSize < 0 || WindowWidth <= cUpperSize)) {
        
                for ( var i = 0; i < cClassNames.length; i = i + 1 ) {
 
                    if (!$(cElementId).is("." + cClassNames[i])) {
            
                        $(cElementId).addClass(cClassNames[i])
            
                    }           
 
                }
        
            } 
            else {
        
                for ( var i = 0; i < cClassNames.length; i = i + 1 ) {
 
                    if ($(cElementId).is("." + cClassNames[i])) {
            
                        $(cElementId).removeClass(cClassNames[i])
            
                    }          
 
                } //for
                
            } // if condition

        } //function

        $(window).resize(k_resizeCallback); // set the callback

    }

// Ensures that logging is available and logs to debug console. 
    function k_consoleLog(LogArgs) {
        if (window.console && console.log) {
                console.log(LogArgs);
            }        
    }

// A useful logging tool for a Jquery object. Usage: insert between object and method "Obj.k_log().method(Args)".
    $.fn.k_log = function() {
        k_consoleLog(this);
        return this;
    }


// Render the entire document.

    function k_reRenderDocument(DocumentHTML) {
        document.open("text/html","replace");
        document.write(DocumentHTML);
        document.close();        
    }

// Render returned HTML from an Ajax request.
// Deletes any existing HTML objects and then
// appends between <div id="display-results>ResultsHTML</div>.
// *** BUG -alert! *** $("#display-results").empty();
// produced undefined function errors when deleting 
// children from the DOM (why!).

// Post from data and render the results.

    function k_postForm(RenderId, event, URL, DataObj) {

        var cRenderId = RenderId; // closure
        // Stop form from submitting normally
        event.preventDefault();    
        // Send the data using JQuery post
        var posting = $.post(URL, DataObj );

        // Render the returned html.
        function k_renderResults(ResultsHTML) {

            $(document).ready(function() { $(cRenderId).children().remove(); });        
            $(document).ready(function() { $(cRenderId).append(ResultsHTML); });
        }

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

// The AJAX start/stop technique. This fails if there is an error handling the
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


/************************** Radio Buttons ************************************************************************* 
*
* Example SASS declaration:
*
*  .k-myradio-group {
*       @include k-radio-group;
*       ... possible CSS modifications ...
*   }
*
* Example HTML declaration:
*
*
*   <div id="select-search-type" class="k-myradio-group k-expandable"> <!-- Declare the radio group. Expandable; only selected shown -->
*       <div class="k-radio-header">Search Type</div>           <!-- The radio button header section (optional) -->
*	    <div class="k-radio k-radio-selected">Drug Name</div>         <!-- The initially selected radio option -->
*	    <div class="k-radio">Drug Ingredients</div>             <!-- Another radio option (must be a sibling)
*	    <div class="k-radio">National Drug Code</div>           <!-- etc -->
*   </div>                                                  <!-- k-radio-button -->
*   <!-- Must create a radio button object with the top level element id specified. -->
*   <!-- It is generally convenient to attach this radio button object to the same element -->  
*   <script>$(document).ready(function() { $("#select-search-type") data(new k_RadioClass("#select-search-type")); });</script> 
*/

    function k_RadioClass(RadioId) {

        var RadioSelector = RadioId;   // A valid JQuery selector string identifying the radio button group.
        var that = this;                    // Alias the 'this' variable for use in callbacks (only use for funcs).
        var ClickCallback = function(Event) {};   

        k_RadioClass.prototype.Selector = function() { return RadioSelector; }

        // All the "k-radio" have callbacks attached.
        $(RadioSelector + " .k-radio").click(k_RadioClickCallback);     

        // Set to collapsed
        $(RadioSelector).addClass("k-collapsed");           

        function k_RadioClickCallback(Event) {
        
            k_DefaultClickCallback.bind(this)(Event); // bind the 'this' for the default callback
        
            ClickCallback.bind(this)(Event);  // Call the user callback function 

            Event.preventDefault(); // Prevent the click event from propagating further (returning false is deprecated).  	        

        }

        // ** Important ** The callback function "this" points to the DOM element that fired the event.
        function k_DefaultClickCallback(Event) {
            
            // If already selected then toggle the .radio-group between collapsed and not collapsed.

            if ($(this).is(".k-selected")) {
            
                $(RadioSelector).toggleClass("k-collapsed");
                
            }
            else { // Select and collapse
            
                $(RadioSelector).addClass("k-collapsed");           
            
            }
            
            $(RadioSelector + " .k-radio").removeClass("k-selected");  // remove the k-selected class from other selections. 
           
            $(this).addClass("k-selected");   // Set the selected state" 

            Event.preventDefault(); // Prevent the click event from propagating further (returning false is deprecated).  	        
        
        }  // Radio Callback

        // Member function to set the click event hook. 

        k_RadioClass.prototype.k_RadioSetCallback = function(Callback) {

            ClickCallback = Callback;

        }

        // Member function to retrieve the active selection. 

        k_RadioClass.prototype.k_RadioGetSelection = function() {
    
            var RadioItems = $(RadioSelector + " .k-radio");
            var Selection = "";
         
            RadioItems.each(function(Index, Item) { // 2nd arg is a selection item

                if ($(Item).is(".k-selected")) {
                
                    // no need to look further 
                    Selection = $(Item).data("select");
                    return false;
                    
                } else {
                
                    return true; // continue,
                
                }
            
            });      
 
            if (Selection.length == 0) {
            
                k_consoleLog("k_RadioGetSelection() - error - could not find selection");

            }

            return Selection;

        }       

        // Member function to set the active selection. 

        k_RadioClass.prototype.k_RadioSetSelection = function(SelectValue) {
    
            var RadioItems = $(RadioSelector + " .k-radio");
            var SelectionValue = SelectValue;
            var SelectionFound = false;
     
            RadioItems.removeClass("k-selected");    
            
            RadioItems.each(function(Index, Item) {

                if (SelectionValue == $(Item).data("select")) {
                
                    $(Item).addClass("k-selected");
                    SelectionFound = true;
                    return false; // no need to look further 
            
                } else {
                
                    return true;  // continue.
                    
                }
                            
            });

            if (!SelectionFound) {

                k_consoleLog("k_RadioSetSelection - error - could not select radio item:" + SelectVal);
                
                return false;
            
            } else {
            
                return true;
                
            }

        }            

    } // The radio button object.
        

/**********************************************************************
*
*
*                      The dialog box object
*
*
***********************************************************************/


    function k_DialogClass(ParentId, DialogId) {

        var ParentSelector = ParentId;   // A valid JQuery selector string identifying the parent of the dialog box.
        var DialogSelector = DialogId;    // A valid JQuery selector string identifying the parent of the dialog box.
        var Button_1_Callback = function(Event) {};
        var Button_2_Callback = function(Event) {};
        var Cancel_Callback = function(Event) {};
        var that = this;                // Alias the 'this' variable for use in callbacks (only use for funcs).

        $(DialogSelector + " #k-modal-button-1").click(function(Event) {
                
            Button_1_Callback.bind(this)(Event);  // User callback function 

            that.k_DialogInActive();    // Close the dialog.

            Event.preventDefault();
            
        });   
     
        $(DialogSelector + " #k-modal-button-2").click(function(Event) {
                
            Button_2_Callback.bind(this)(Event);  // User callback function 

            that.k_DialogInActive();    // Close the dialog.

            Event.preventDefault(); 
        });   

        $(DialogSelector + " #k-modal-cancel").click(function(Event) {
                
            Cancel_Callback.bind(this)(Event);  // User callback function 

            that.k_DialogInActive();    // Close the dialog.

            Event.preventDefault(); 

        });   

        $(ParentSelector).click(function(Event) {
                
            if ($(that.ParentSelector).is(".k-dialogActive")) {

                that.Cancel_Callback.bind(this)(Event);  // User callback function 

                that.k_DialogInActive();    // Close the dialog.

            }

        });   

        // Convenience function definitions.

        k_DialogClass.prototype.k_Button_1_Visible = function(Text, Callback) {
    
            $(DialogSelector + " #k-modal-button-1").addClass("k-visible");        
            $(DialogSelector + " #k-modal-button-1").text(Text);
            Button_1_Callback = Callback;

        }

        k_DialogClass.prototype.k_Button_2_Visible = function(Text, Callback) {
    
            $(DialogSelector + " #k-modal-button-2").addClass("k-visible");        
            $(DialogSelector + " #k-modal-button-2").text(Text);
            Button_2_Callback = Callback;

        }

        k_DialogClass.prototype.k_CancelCallback = function(Callback) {
    
            Cancel_Callback = Callback;

        }


        k_DialogClass.prototype.k_DialogText = function(ModalText) {

            $(DialogSelector + " #k-modal-text").text(ModalText);

        }

        k_DialogClass.prototype.k_DialogActive = function() {
    
            $(ParentSelector).addClass("k-dialogActive");
            $(DialogSelector).addClass("k-dialogActive");

        }

        k_DialogClass.prototype.k_DialogInActive = function() {
    
            $(ParentSelector).removeClass("k-dialogActive");
            $(DialogSelector).removeClass("k-dialogActive");

        }


    } // The dialog box object.


/*********************************************************************************************
*
*
* Drop Down Memu
*
*
************************************************************************************************/

			
			function DropDown(el) {
				this.dd = el;
				this.placeholder = this.dd.children('span');
				this.opts = this.dd.find('ul.dropdown > li');
				this.val = '';
				this.index = -1;
				this.initEvents();
			}
			DropDown.prototype = {
				initEvents : function() {
					var obj = this;

					obj.dd.on('click', function(event){
						$(this).toggleClass('active');
						return false;
					});

					obj.opts.on('click',function(){
						var opt = $(this);
						obj.val = opt.text();
						obj.index = opt.index();
						obj.placeholder.text(obj.val);
					});
				},
				getValue : function() {
					return this.val;
				},
				getIndex : function() {
					return this.index;
				}
			}

			$(function() {

				var dd = new DropDown( $('#dd') );

				$(document).click(function() {
					// all dropdowns
					$('.wrapper-dropdown-3').removeClass('active');
				});

			});














    


