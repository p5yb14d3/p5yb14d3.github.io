/*!
 * Mousenav
 * http://github.com/p5yb14d3/keynav
 *
 * Copyright (c) 2018, p5yb14d3
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://github.com/p5yb14d3/keynav/LICENSE
 *
 */

// INITIALIZE MOUSENAV_BACK
$(document).ready(function() {
	// DOM: ELEMENTS
	var audio_back = $("audio")[2];
	var $audio_back = $("#audio_back");

	// MOUSE: STOP CONTEXTMENU
	document.oncontextmenu = function() {
		return false;
	};
	// MOUSE: ON RIGHT CLICK
	$(document).mousedown(function(e) { 
		if (e.button == 2) {
			audio_back.play();
			e.preventDefault();
			return false; 
			}
		return true; 
	}); 
	
	// AUDIO: AUDIO_BACK ON ENDED
	$audio_back.on('ended', function() {
		history.back();
	});
});