(function( $ ){
	$.fn.slider = function( leftButton, rightButton,  options) {
		return this.each(function() {
			// Create some defaults, extending them with any options that were provided
			var settings = $.extend( {
				'PageSize'	:	'responsive',
				'Whitespace'	:	false,
				'ButtonsCSS'	:	true
			}, options);
            
			//vars
			var outerDiv = $(this);
			var innerDiv = outerDiv.children();
			var galleryDiv = outerDiv.parent();
			var tiles = innerDiv.children();
			var numButtons = tiles.length;
			var imgObjects = tiles.find('img');
			var singleImgObject = imgObjects.first();
			var imgMargin = parseFloat(singleImgObject.css("margin-right"));
			
			//check for div containers and adjust css
            if(tiles.is('div')){
                tiles.css("float","left");
                imgObjects.css("float","none");
                imgObjects.siblings().css("margin-right",imgMargin);
            }

			//last image does not need
			imgObjects.last().css("margin-right","0");
			
			//widthPerTile
			var widthPerTile = 0;			
			widthPerTile += singleImgObject.width();
			widthPerTile += imgMargin;
			widthPerTile += parseFloat(singleImgObject.css("border-left-width"));
			widthPerTile += parseFloat(singleImgObject.css("border-right-width"));			
			
			//dynamic vars
			var responsiveSwitch = false;
			var buttonSwitch = buttons();  //button switch is encapsulated in a closure
			var currentPage = 1;
			var windowWidth = 0;
			var slideWidth = 0;

			//check for responsive or auto
			//calculate the width of innerDiv and outerDiv
			if ( $.trim(settings.PageSize.toLowerCase()) == "responsive" )
			{
				responsiveSwitch = true;
			}
			if ( $.trim(settings.PageSize.toLowerCase()) == "auto" || $.trim(settings.PageSize.toLowerCase()) == "responsive")
			{
				//spaceAvailable
				if(settings.ButtonsCSS)
				{
					var distanceFromLeft = parseFloat(leftButton.css("left"))+parseFloat(leftButton.css("width"));
					var spaceAvailable = galleryDiv.width() - distanceFromLeft*2;
				}
				else
				{
					var distanceFromLeft = 0;
					var spaceAvailable = galleryDiv.width();
				}
				var returnVars = responsiveCalculations(widthPerTile, spaceAvailable, numButtons);
				windowWidth = returnVars[0];
				settings.PageSize = returnVars[1];
			}
			else
			{
				windowWidth = widthPerTile*settings.PageSize;
			}
			var numPages = Math.ceil(numButtons/settings.PageSize);
			slideWidth = windowWidth*numPages;
			var innerPanDistance = numButtons*widthPerTile;			
			
			//set width for inner and outer
			outerDiv.css("width",windowWidth);
			innerDiv.css("width",slideWidth);
			
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
			
			if(settings.ButtonsCSS)
			{
				var a = galleryDiv.height()/2;
				var b = leftButton.height()/2;
				leftButton.css("top", (a)-(b));
				rightButton.css("top", (a)-(b));
				rightButton.css("right", leftButton.css("left"));	
			}
		
			//activate buttons
			updateButtonStatus(currentPage, numPages, leftButton, rightButton);  
			leftButton.click(function() {
				currentPage = pan(currentPage, numPages, -1, buttonSwitch, windowWidth, innerPanDistance, innerDiv, settings.Whitespace);
				updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
			});
			rightButton.click(function() {
				currentPage = pan(currentPage, numPages, 1, buttonSwitch, windowWidth, innerPanDistance, innerDiv, settings.Whitespace);
				updateButtonStatus(currentPage,numPages, leftButton, rightButton);        
			});     
			
			//activate responsive
			if ( responsiveSwitch )
			{
				$(window).resize(function(){
					spaceAvailable = galleryDiv.width() - distanceFromLeft*2;
					if ( windowWidth > spaceAvailable  || windowWidth+widthPerTile < spaceAvailable )
					{
						var returnVars = responsiveCalculations(widthPerTile, spaceAvailable, numButtons )
						windowWidth = returnVars[0];
						settings.PageSize = returnVars[1];
						numPages = Math.ceil(numButtons/settings.PageSize);
						outerDiv.css("width",windowWidth);
						innerDiv.css("margin-left","0").css("width",windowWidth*numPages);
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
			var windowWidth = 0;
			var numChildrenPerPage = 0;
			
			//calculate numChildrenPerPage and windowWidth
			while ( windowWidth+widthPerTile <= spaceAvailable &&  numChildrenPerPage <= numButtons-1 )
			{
				windowWidth += widthPerTile;
				numChildrenPerPage += 1;
			}
						
			//do not allow 0 tiles
			if (windowWidth == 0)
			{
				windowWidth += widthPerTile;
				numChildrenPerPage += 1;
			}
			
			var returnVars = Array();
			returnVars[0] = windowWidth;
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
		function pan(currentPage, numPages, pages, buttonSwitch, windowWidth, slideWidth, innerDiv, clipEdge)
		{
            var distance;
			if(buttonSwitch())
			{
				//deactivate buttons
				buttonSwitch("swap");
				if(!clipEdge)
				{
					//if second to last page and panning right		
					if(currentPage == numPages-1 && pages > 0)
					{
							distance = windowWidth-slideWidth;
					}
					//if second page and panning left
					else if(currentPage == 2 && pages < 0)
					{
							distance = 0;
					}
					else
					{
							distance = "-="+(windowWidth)*pages+"px";
					}
				}
				else
				{
					distance = "-="+(windowWidth)*pages+"px";
				}
				
				//set newPage
				newPage = currentPage+pages;
				
				//animate left at calculated distance at a slow speed, reactivate buttons on completion
				innerDiv.animate({"margin-left": distance}, "slow",	function(){ buttonSwitch("swap"); });
				return newPage;
			}
			return currentPage;
		}
		
	
	};
})( jQuery );