/*!
 * Mousenav
 * http://github.com/p5yb14d3/keynav
 *
 * Copyright (c) 2018, p5yb14d3
 * Released under MIT license.
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
			e.preventDefault();
			if (typeof audio_back !== "undefined") {
				audio_back.play();
			}
			else {
				history.back();
			}
			return false; 
		}
		return true; 
	}); 
	
	// AUDIO: AUDIO_BACK ON ENDED
	$audio_back.on('ended', function() {
		history.back();
	});
});