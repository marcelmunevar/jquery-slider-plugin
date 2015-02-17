All images and files are completely free for both commercial use and private use.

1. Include CSS & JavaScript
<link href="slider.css" rel="stylesheet" >
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="slider.js"></script>

2. Include HTML
<div class="gallery">
    <div class="leftButton"></div>
    <div class="rightButton"></div>
    <div class="outerWrapper">
        <div class="innerWrapper">
            <a href="img/fullsize/1.jpg" rel="group1"><img src="img/thumbs/1.jpg" width="144" height="109"></a>
            <a href="img/fullsize/2.jpg" rel="group1"><img src="img/thumbs/2.jpg" width="144" height="109"></a>
            <a href="img/fullsize/3.jpg" rel="group1"><img src="img/thumbs/3.jpg" width="144" height="109"></a>
            <a href="img/fullsize/4.jpg" rel="group1"><img src="img/thumbs/4.jpg" width="144" height="109"></a>
            <a href="img/fullsize/5.jpg" rel="group1"><img src="img/thumbs/5.jpg" width="144" height="109"></a>
            <a href="img/fullsize/6.jpg" rel="group1"><img src="img/thumbs/6.jpg" width="144" height="109"></a>
            <a href="img/fullsize/7.jpg" rel="group1"><img src="img/thumbs/7.jpg" width="144" height="109"></a>
            <a href="img/fullsize/8.jpg" rel="group1"><img src="img/thumbs/8.jpg" width="144" height="109"></a>
            <a href="img/fullsize/9.jpg" rel="group1"><img src="img/thumbs/9.jpg" width="144" height="109"></a>
        </div>
    </div>
</div>
                
3. Fire Plugins using jQuery Selectors
//on page load
jQuery(function() {
    jQuery(".outerWrapper").slider(
        jQuery(".leftButton"),
        jQuery(".rightButton"),
        {
            'PageSize'	:	'auto',
            'Whitespace'	:	true,
            'ButtonsCSS'	:	false
        }
    );
});
				
4. Customize slider.css