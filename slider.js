(function( $ ){

	$.fn.slider = function( leftButton, rightButton,  options) {  
	
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			'numChildrenPerPage'	:	'1',
			'clipEdge'	:	'true'
		}, options);
		
		
		
		
			 
		return this.each(function() {
					//static variables
					var outerDiv = $(this);
					var innerDiv = outerDiv.children();
					var galleryDiv = outerDiv.parent();
					var tiles = innerDiv.children();
					var imgObjects = tiles.children();
					var imgMargin = parseFloat(imgObjects.css("margin-right"));
					var numButtons = tiles.length;
					var numPages = Math.ceil(numButtons/settings.numChildrenPerPage);
					//var adjustment = Math.ceil(outerDiv.width()/settings.numChildrenPerPage)*settings.numChildrenPerPage-outerDiv.width();
					//var widthChildren = Math.ceil(outerDiv.width()/settings.numChildrenPerPage); //this is no longer used but can be useful when debugging
					
					//dynamic variables
					var buttonSwitch = buttons();  //button switch is encapsulated in a closure
					var currentPage = 1;
					var widthOfOuter = 0;
					var widthOfInner = 0;
					
					//calculate and set some css values
					if(imgMargin == 0)
					{
						outerDiv.css("margin-top", outerDiv.css("padding-top") );
						outerDiv.css("margin-bottom", outerDiv.css("padding-bottom") );
						outerDiv.css("padding-top", 0);
						outerDiv.css("padding-bottom", 0);
						outerDiv.css("box-shadow", imgObjects.css("box-shadow"));
						imgObjects.css("box-shadow", "none");
					}
					else
					{
						innerDiv.css("padding-left", imgMargin/2);
					}					
					var a = galleryDiv.height()/2;
					var b = leftButton.height()/2;
					leftButton.css("top", (a)-(b));
					rightButton.css("top", (a)-(b));
					rightButton.css("right", leftButton.css("left"));
										
					//calculate the width of innerDiv and outerDiv
					tiles.each(function (i) {						
							widthOfInner += $(this).width();
							widthOfInner += parseFloat($(this).css("margin-right"));
							widthOfInner += parseFloat($(this).css("border-left-width"));
							widthOfInner += parseFloat($(this).css("border-right-width"));
							console.log()
							//set widthOfOuter after first page is calculated
							if( i == settings.numChildrenPerPage-1 )
							{
								widthOfOuter = widthOfInner;
							}
					});			
					
					//calculate space available for gallery
					spaceAvailable = (((parseFloat(leftButton.css("left"))+parseFloat(leftButton.css("width")))*2)-parseFloat(galleryDiv.width()))*-1;
					console.log("a"+widthOfOuter);
					console.log("b"+spaceAvailable);
					
					//make sure there is enough space in parent
					if(widthOfOuter  <= spaceAvailable)
					{
						//set width for inner and outer
						outerDiv.css("width",widthOfOuter);//-adjustment);
						innerDiv.css("width",widthOfInner);			
						
						//if there is more than one page
						if(numPages > 1)
						{	
								//activate buttons
								updateButtonStatus(currentPage,numPages, leftButton, rightButton);  
								leftButton.click(function() {
									currentPage = pan(currentPage,numPages,-1, buttonSwitch, widthOfOuter, widthOfInner, innerDiv, settings.clipEdge);
									updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
								});
								rightButton.click(function() {
									currentPage = pan(currentPage,numPages,1, buttonSwitch, widthOfOuter, widthOfInner, innerDiv, settings.clipEdge);
									updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
								});							      
						}
						else
						{
								leftButton.css("visibility","hidden");
								rightButton.css("visibility","hidden");
						}        
						
						//make images visible
						imgObjects.css("visibility","visible");
					}
					else
					{
						outerDiv.html("<p style='text-align:center;'><br><br>The slider won't fit in the gallery div.<br>Either reduce numChildrenPerPage or increase the width of the gallery.</p>");
					}
		
		});
		
		//encapsulated button switch
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
		
		//checks and updates button visibility
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
		
		//when a user clicks a button
		function pan(currentPage, numPages, pages, buttonSwitch, widthOfOuter, widthOfInner, innerDiv, clipEdge)
		{
				
				if(buttonSwitch())
				{
						//deactivate buttons
						buttonSwitch("swap");
						
						
						if(clipEdge == "true")
						{
							//if second to last page and panning right		
							if(currentPage == numPages-1 && pages > 0)
							{
									distance = 0-widthOfInner+widthOfOuter;
							}
							//if second page and panning left
							else if(currentPage == 2 && pages < 0)
							{
									distance = 0;
							}
							else
							{
									distance = "-="+(widthOfOuter)*pages+"px";
							}
						}
						else
						{
								distance = "-="+(widthOfOuter)*pages+"px";
								
						}
						
						//set newPage
						newPage = currentPage+pages;
						
						//animate left at calculated distance at a slow speed, reactivate buttons on completion
						innerDiv.animate({"left": distance}, "slow",	function(){ buttonSwitch("swap"); });
						
						return newPage;
				}
				
				return currentPage;
				
		}
		
	
	};
})( jQuery );