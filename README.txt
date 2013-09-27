//v1.0
//Plugin makes slider that slides left and right.
//see it in action on benjamin moore's mobile website
//http://m.benjaminmoore.com/paint-colors/color/opal

//example
//$(outerWrapper).slider( leftButton, rightButton,{'numChildrenPerPage'	:	'8', 'clipEdge'	:	'true'})
//numChildrenPerPage = number of items displayed on each page of the slider.
//clipEdge = Wether last page has empty space (if not full page).

//html structure
//"outerWrapper" must have a child "innerWrapper" div. That "innerWrapper" div must have multiple children. 
//"leftButton" and "rightButton" must be outside of the "outerWrapper"


//required css
<style>
#leftButton, #rightButton
{
	visibility:hidden;
	cursor:pointer;
}
#outerWrapper
{
	width:727px;
	height:150px;
	overflow:hidden;
}
#innerWrapper
{
	height:150px;
	overflow:hidden; 
	position:relative;
}
</style>

<SCRIPT LANGUAGE="JavaScript" SRC="jquery.js"></script> //first include jquery
<SCRIPT LANGUAGE="JavaScript" SRC="slider.js"></script> //then include slider plugin

<script>
	jQuery(function() {
		jQuery("#outerWrapper").slider(
		jQuery("#leftButton"), 
		jQuery("#rightButton"), 
		{
			'numChildrenPerPage' : '8', 
			'clipEdge'  : 'true'	
		}
	);
</script>