/*!
 * Mousenav
 * http://github.com/p5yb14d3/keynav
 *
 * Copyright (c) 2018, p5yb14d3
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://github.com/p5yb14d3/keynav/LICENSE
 *
 */
 
// INITIALIZE MOUSENAV_CLICK
$(document).ready(function() {
	// DOM: ELEMENTS
	var $item = $('li');
	var audio_click = $("audio")[1];
	var $audio_click = $("#audio_click");

	// MOUSE: ON CLICK
    $item.click(function() {
		// UPDATES CURRENT POSITION
		var index = $(this).parent().children().index(this);
		keynav.position_current = index;
		
		// SET SELETECT LI TO CURRENT POSITION
		keynav.setLISelectedToCurrentPosition($(this));
	
		// REFRESH SCROLLING
		keynav.scrollToView();
		
		// PLAY SOUND
		audio_click.play();
    });
	
	// AUDIO: AUDIO_CLICK ON ENDED
	$audio_click.on('ended', function() {
		confirm_selection()
	});
});