/*!
 * Mousenav
 * http://github.com/p5yb14d3/keynav
 *
 * Copyright (c) 2018, p5yb14d3
 * Released under MIT license.
 * http://github.com/p5yb14d3/keynav/LICENSE
 *
 */


// GLOBAL VARIABLES
var currentMousePos = { x_old: -1, y_old: -1, x: -1, y: -1};

// INITIALIZE MOUSENAV_HOVER
$(document).ready(function() {
	// DOM: ELEMENTS
	var $item = $('li');
	var audio_hover = $("audio")[0];
	
	// MOUSE: KEEPS TRACK OF MOUSE POSITION IN ORDER TO DETERMINE IF IT IS STATIONARY
	$(document).mousemove(function(e) {
		currentMousePos.x_old = currentMousePos.x;
        currentMousePos.y_old = currentMousePos.y;
		currentMousePos.x = e.pageX;
        currentMousePos.y = e.pageY;
	});
 
	// MOUSE: ON MOUSEOVER
    $item.mouseover(function() {
		// ALLOW MOUSE ACTIVITY ONLY IF MOUSE IS NOT STATIONARY (i.e. MOUSE NEW POSITION IS DIFFERENT FROM OLD POSITION)
		if ((currentMousePos.x < currentMousePos.x_old-2) || (currentMousePos.x > currentMousePos.x_old+2) || (currentMousePos.y < currentMousePos.y_old-2) || (currentMousePos.y > currentMousePos.y_old+2)) {
			// console.log('mouseover detected:'+currentMousePos.x+" old:"+currentMousePos.x_old+","+currentMousePos.y+" old:"+currentMousePos.y_old);
			keynav.liSelected.removeClass("selected");
			$(this).addClass("hover");
			if (typeof audio_hover !== "undefined") audio_hover.play();
			}
    });
	
	// MOUSE: ON MOUSEOUT
    $item.mouseout(function() {
		$(this).removeClass("hover");
    });
});