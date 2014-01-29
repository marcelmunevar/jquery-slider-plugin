(function( $ ){

  $.fn.slider = function( leftButton, rightButton,  options) {  
  
    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'numChildrenPerPage'                : '1',
      'clipEdge'                        : 'true'
    }, options);




         
    return this.each(function() {
                var object = $(this);
                var numButtons = countButtons(object.children());
                var numPages = Math.ceil(numButtons/settings.numChildrenPerPage);
                //var widthChildren = Math.ceil(object.width()/settings.numChildrenPerPage);
				var currentPage = 1;
                var adjustment = Math.ceil(object.width()/settings.numChildrenPerPage)*settings.numChildrenPerPage-object.width();
				
				
				
                function buttons() {
                        var buttonsAreActive = true; // local variable
                        
                        var  temp = function(action) 
                        {
                                if(action == "swap")
                                {
                                        buttonsAreActive = !buttonsAreActive; 
                                }
                                else
                                {
                                        return buttonsAreActive; 
                                }
                        }
                        return temp;
                }
                
                var buttons = buttons();
                
                
				//get width for outer
				//get width for inner.
                var widthOfOuter = 0;               
                var widthOfInner = 0;
                object.children().children().each(function (i) {
                        
                        widthOfInner += $(this).width();
						widthOfInner += parseInt($(this).css("margin-right"));
						widthOfInner += parseInt($(this).css("padding-left"));
						widthOfInner += parseInt($(this).css("padding-right"));
						if( i == settings.numChildrenPerPage-1 )
						{
							widthOfOuter = widthOfInner;
						}
						
                });
				
								
				widthOfOuter -= adjustment;
					
					
				if(widthOfOuter  <= object.parent().width())
				{
					//set width for inner and outer
					object.css("width",widthOfOuter).children().css("width",widthOfInner);
					
					
					
					if(numPages > 1)
					{
							updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
					}
					else
					{
							leftButton.css("visibility","hidden");
							rightButton.css("visibility","hidden");
					}        
					
					leftButton.click(function() {
							currentPage = pan(currentPage,numPages,-1, buttons, object, adjustment, settings.clipEdge);
							updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
					});
					rightButton.click(function() {
							currentPage = pan(currentPage,numPages,1, buttons, object, adjustment, settings.clipEdge);
							updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
					});
					
					object.find("img").css("visibility","visible");
				}
				else
				{
					object.html("<p style='text-align:center;'><br><br>Too many numChildrenPerPage.<br>Either reduce numChildrenPerPage or increase the width of the gallery.</p>");
				}

    });
        
        
        function countButtons(inner)
        {
                var numButtons = 0;
                inner.children().each(function () {
                        numButtons += 1;
                });                                
                return numButtons;
        }
        function updateButtonStatus(currentPage,numPages,leftButton,rightButton)
        {
                if(currentPage == numPages)
                {
                        rightButton.css("visibility","hidden");
                        leftButton.css("visibility","visible");
                }
                else if(currentPage == 1)
                {
                        leftButton.css("visibility","hidden");
                        rightButton.css("visibility","visible");
                }
                else
                {
                        leftButton.css("visibility","visible");
                        rightButton.css("visibility","visible");
                }
        }
        function pan(currentPage, numPages, pages, buttons, object, adjustment, clipEdge)
        {
                if(currentPage+pages > 0 && currentPage+pages <= numPages && buttons())
                {
                        buttons("swap");
                        if(clipEdge == "true")
                        {
                                if(currentPage == numPages-1 && pages > 0)
                                {
                                        distance = 0-object.children().width()+object.width()+adjustment;
                                }
                                else if(currentPage == 2 && pages < 0)
                                {
                                        distance = 0;
                                }
                                else
                                {
                                        distance = "-="+(object.width()+adjustment)*pages+"px";
                                }
                        }
                        else
                        {
                                distance = "-="+(object.width()+adjustment)*pages+"px";
								
                        }
                        newPage = currentPage+pages;
                        object.children().animate({"left": distance}, "slow",
                                function() 
                                {
                                        
                                        buttons("swap");
                                }                                        
                        );
						
                        return newPage;
                }
                else
                {
                        return currentPage;
                }
                
        }
        

  };
})( jQuery );