(function( $ ){

	$.fn.slider = function( leftButton, rightButton,  options) {  
	
		
		
		return this.each(function() {
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				'numChildrenPerPage'	:	'1',
				'clipEdge'	:	'true'
			}, options);
			
			//jquery objects
			var outerDiv = $(this);
			var innerDiv = outerDiv.children();
			var galleryDiv = outerDiv.parent();
			var tiles = innerDiv.children();
			var imgObjects = tiles.children();
			
			//misc
			var numButtons = tiles.length;
			var imgMargin = parseFloat(imgObjects.css("margin-right"));
			
			//spaceAvailable
			var distanceFromLeft = parseFloat(leftButton.css("left"))+parseFloat(leftButton.css("width"));
			var spaceAvailable = ( distanceFromLeft*2 - parseFloat(galleryDiv.width()) )*-1;
			
			
			//widthPerTile
			var widthPerTile = 0;
			var singleTile = imgObjects.first();
			widthPerTile += singleTile.width();
			widthPerTile += parseFloat(singleTile.css("margin-right"));
			widthPerTile += parseFloat(singleTile.css("border-left-width"));
			widthPerTile += parseFloat(singleTile.css("border-right-width"));
			
			//dynamic variables
			var responsiveSwitch = false;
			var buttonSwitch = buttons();  //button switch is encapsulated in a closure
			var currentPage = 1;
			var widthOfOuter = 0;
			var widthOfInner = 0;

			//check for responsive or auto
			if ( $.trim(settings.numChildrenPerPage.toLowerCase()) == "responsive" )
			{
				responsiveSwitch = true;
			}
			if ( $.trim(settings.numChildrenPerPage.toLowerCase()) == "auto" || $.trim(settings.numChildrenPerPage.toLowerCase()) == "responsive")
			{
				var returnVars = responsiveCalculations(widthPerTile, spaceAvailable, numButtons);
				settings.numChildrenPerPage = returnVars[1];
			}
			
			//numPages
			var numPages = Math.ceil(numButtons/settings.numChildrenPerPage);

			//calculate the width of innerDiv and outerDiv
			for(i=0; i < numButtons; i++)
			{
				widthOfInner += widthPerTile;
				//set widthOfOuter after first page is calculated
				if( i == settings.numChildrenPerPage-1 )
				{
					widthOfOuter = widthOfInner;
				}
			}
			
			
			//set width for inner and outer
			outerDiv.css("width",widthOfOuter);
			innerDiv.css("width",widthOfInner);
			
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
		
			//activate buttons
			updateButtonStatus(currentPage, numPages, leftButton, rightButton);  
			leftButton.click(function() {
				currentPage = pan(currentPage, numPages, -1, buttonSwitch, widthOfOuter, widthOfInner, innerDiv, settings.clipEdge);
				updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
			});
			rightButton.click(function() {
				currentPage = pan(currentPage, numPages, 1, buttonSwitch, widthOfOuter, widthOfInner, innerDiv, settings.clipEdge);
				updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
			});     
			
			//activate responsive
			if ( responsiveSwitch )
			{
				$(window).resize(function(){
					spaceAvailable = ( distanceFromLeft*2 - parseFloat(galleryDiv.width()) )*-1;
					if ( widthOfOuter > spaceAvailable  || widthOfOuter+widthPerTile < spaceAvailable )
					{
						var returnVars = responsiveCalculations(widthPerTile, spaceAvailable, numButtons )
						widthOfOuter = returnVars[0];
						settings.numChildrenPerPage = returnVars[1];
						outerDiv.css("width",widthOfOuter);
						innerDiv.css("left","0");
						numPages = Math.ceil(numButtons/settings.numChildrenPerPage);
						currentPage = 1;
						updateButtonStatus(currentPage, numPages, leftButton, rightButton);
					}
				});
			}
			
			//make images visible
			imgObjects.css("visibility","visible");
		
			
		});
		
		
		function responsiveCalculations(widthPerTile, spaceAvailable, numButtons)
		{
			var widthOfOuter = 0;
			var numChildrenPerPage = 0;
			
			//calculate numChildrenPerPage and widthOfOuter
			while ( widthOfOuter+widthPerTile <= spaceAvailable &&  numChildrenPerPage <= numButtons-1 )
			{
				widthOfOuter += widthPerTile;
				numChildrenPerPage += 1;
			}
						
			//do not allow 0 tiles
			if (widthOfOuter == 0)
			{
				widthOfOuter += widthPerTile;
				numChildrenPerPage += 1;
			}
			
			var returnVars = Array();
			returnVars[0] = widthOfOuter;
			returnVars[1] = numChildrenPerPage;
			return returnVars;
		}
		
		
		//button switch closure factory
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
			if(numPages == 1)
			{
				leftButton.css("visibility","hidden");
				rightButton.css("visibility","hidden");
			}
			else if(currentPage == numPages)
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