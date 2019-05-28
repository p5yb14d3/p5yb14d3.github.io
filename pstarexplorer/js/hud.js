String.prototype.replaceAll = function(search, replacement) {
	return this.split(search).join(replacement)
};

/* HUD */

function classHUD(iUI) {
	var ui = iUI;
	var hud = this;
	var info = {}
	var stats = {}
	var LPage = -1;
	var RPage = -1;
	var RPageCount = 0;
	this.visible = true;
	this.font_size_limit = 200; // FONT SIZE IN PERCENTAGE

	this.init = function() {
		this.createTextBox("L", 0, "");
		this.drawLine("L", "create", 0, "middle");
		for (i=0; i < 6; i++) {
			this.createTextBox("R", i, "");
			this.drawLine("R", "create", i, "middle");
		}
	};

	this.reset = function() {
		// CLEAR HUD CELLS
		$("#textbox_L0").html("&nbsp;");
		for (x=0; x < 6; x++) {
			$("#textbox_R"+x).html("&nbsp;");
		}
		// RESET PAGE
		LPage = -1;
		RPage = -1;
	};

	this.loadInfoAndStats = function(object_name) {
		if ((this.visible) || (typeof this.visible === "undefined")) {
			this.reset();
			$.get('info/'+object_name+'_info.txt', this.onFileReceivedInfo, 'text');
			$.get('info/'+object_name+'_stats.txt', this.onFileReceivedStats, 'text');
		}
	};
		
	this.onFileReceivedInfo = function(data) {
		data = data.replaceAll("[[", "<div>");
		data = data.replaceAll("]]", "</div>");
		var infoArray = data.split("\\r\\n\\r\\n");
		info[ui.space.object_name] = infoArray;

		let value = info[ui.space.object_name][0];
		$("#textbox_L0").html(value);

		hud.LNext(); // important
	};

	this.onFileReceivedStats = function(data) {
		data = data.replaceAll("[[", "<div>");
		data = data.replaceAll("]]", "</div>");
		var statsArray = data.split("\\r\\n\\r\\n");
		alert(statsArray.length);
		stats[ui.space.object_name] = statsArray;
		
		RPageCount = Math.ceil(stats[ui.space.object_name].length /6);

		hud.RNext();
	};

	this.RBack = function() {
		var lines_to_read = 6;
		
		// CLEAR HUD CELLS
		for (x=0; x < 6; x++) {
			$("#textbox_R"+x).html("&nbsp;");
		}
		
		RPage--;
		if (RPage < 0) {
			RPage=RPageCount-1;
		}

		var index=0;
		var start_from = RPage * lines_to_read;
		for (i=start_from; i < start_from+lines_to_read; i++) {
			// console.log("......", i, stats[object_name][i]);
			$("#textbox_R"+index).html(stats[ui.space.object_name][i]);
			index++;
		}
		this.RUpdate();
	};


	this.RNext = function() {
		var lines_to_read = 6;
		
		// CLEAR HUD CELLS
		for (x=0; x < 6; x++) {
			$("#textbox_R"+x).html("&nbsp;");
		}
		
		RPage++;
		if (RPage > RPageCount-1) {
			RPage=0;
		}

		var index=0;
		var start_from = RPage * lines_to_read;
		
		for (i=start_from; i < start_from+lines_to_read; i++) {
			// console.log("......", i, stats[object_name][i]);
			$("#textbox_R"+index).html(stats[ui.space.object_name][i]);
			index++;
		}
		this.RUpdate();
	};

	this.LNext = function() {
		LPage++;
		if (LPage > info[ui.space.object_name].length - 1) LPage = 0;
		$("#textbox_L0").html(info[ui.space.object_name][LPage]);
		this.LUpdate();
	};

	this.LBack = function() {
		LPage--;
		if (LPage < 0) LPage = info[ui.space.object_name].length - 1;
		$("#textbox_L0").html(info[ui.space.object_name][LPage]);
		this.LUpdate();
	};
	
	this.LUpdate = function() {
		this.fitFont($("#textbox_L0"), 0, $(window).height() * 0.6);
		this.drawLine("L", "refresh", 0, "middle");
	};

	this.RUpdate = function() {
		var size =0;
		var smallest_size = 10000;
		
		// FIND SMALLEST FONT
		for (i=0; i < 6; i ++) {
			size = this.fitFont($("#textbox_R"+i), 0, ($(window).height() * 0.6)/8);
			// console.log("size:"+smallest_size);
			if (size < smallest_size) smallest_size = size;
			}
			
		// MAKE ALL FONTS SAME SIZE
		for (i=0; i < 6; i ++) {
			$("#textbox_R"+i).css("font-size", this.limitSize(smallest_size,200)+"%");
			}
		// UPDATE LINES
		for (i=0; i < 6; i ++) {
			this.drawLine("R", "refresh", i, "middle");
		}
	}
	
	this.limitSize = function(size, limit) {
		if (this.font_size_limit != -1) limit = this.font_size_limit;
		if (size > limit) return limit; else return size;
	};

	this.fitFont = function($element, width, height, refinement=10, low=-1, high=-1, percentage = 300, factor=10, steps=0) {
		// console.log($element.height(), height, low, high, percentage);
		if (!$element.is(":visible")) { // MAKE SURE ELEMENT IS VISIBLE;
			return 200;
		}
		if (steps > 50) { // PREVENT INFINITE RECURSION
			return 200;
		}
		steps++;
		if (factor < refinement) {
			// console.log("returning factor:", factor);
			return percentage;
		}
		if ($element.height() > height) {
			percentage = percentage - factor;
			if (percentage == low) {
				// console.log("1continuing recursion factor:", factor, $element.height(), height);
				return this.fitFont($element, width, height, refinement, percentage, high, percentage, parseInt(factor/2), steps);
			}
			$element.css("font-size", this.limitSize(percentage,250)+"%");
			return this.fitFont($element, width, height, refinement, percentage, high, percentage, factor, steps);
		}
		else if ($element.height() < height) {
			percentage = percentage + factor;
			if (percentage == high) {
				// console.log("2continuing recursion factor:", factor, $element.height(), height);
				return this.fitFont($element, width, height, refinement, low, percentage, percentage, parseInt(factor/2), steps);
			}
			$element.css("font-size", this.limitSize(percentage,250)+"%");
			return this.fitFont($element, width, height, refinement, low, percentage, percentage, factor, steps);
		}
	}
		
	this.createTextBox = function(side, index, text) {
		// Your existing code unmodified...
		var textbox = document.createElement('div');
		textbox.id = 'textbox_'+side+index;
		textbox.className = 'textbox textbox_'+side;
		document.getElementById('textwrapper_'+side).appendChild(textbox);

		// Now create and append to iDiv
		var blank = document.createElement('div');
		blank.id = 'blank_'+side+index;
		blank.className = 'blank';
		document.getElementById('blankwrapper_'+side).appendChild(blank);
		
		textbox.style.width = 100;
		textbox.style.height = 100;
		textbox.innerHTML = text;
		textbox.style.top = 0+ 'px';
		textbox.style.left = 0+ 'px';
	}

	this.createLineElement = function(side, index, x, y, length, angle) {
		var line = document.createElement("div");
		line.id = "line_"+side+index;
		line.className = "line";
		this.updateLine(line, x, y, length, angle);
		return line;
	}

	this.updateLine = function(line, x, y, length, angle) {
		var styles = ''
				   + 'width: ' + length + 'px; '
				   + 'height: 0px; '
				   + '-moz-transform: rotate(' + angle + 'rad); '
				   + '-webkit-transform: rotate(' + angle + 'rad); '
				   + '-o-transform: rotate(' + angle + 'rad); '  
				   + '-ms-transform: rotate(' + angle + 'rad); '  
				   + 'position: absolute; '
				   + 'top: ' + y + 'px; '
				   + 'left: ' + x + 'px; ';
		if ($('.line').is(":visible")) line.setAttribute('style', styles);  
		return line
	}

	this.calculateLine = function(x1, y1, x2, y2) {
		var a = x1 - x2,
			b = y1 - y2,
			c = Math.sqrt(a * a + b * b);

		var sx = (x1 + x2) / 2,
			sy = (y1 + y2) / 2;

		var x = sx - c / 2,
			y = sy;

		var alpha = Math.PI - Math.atan2(-b, a);
		
		return [x, y, c, alpha];
	}
	
	this.drawLine= function(side, command, index, start_y) {
		var textcontainer = $("#textcontainer_"+side);
		textcontainer_top = ($(window).height() - textcontainer.outerHeight())/2;
		textcontainer.css("top", textcontainer_top);
		textcontainer.css("display", "block");
		// if ($(window).height() < $(window).width()) {
			// textcontainer.css("display", "block");
		// } else {
			// textcontainer.css("display", "none");
		// }

		var link = $("#textbox_"+side+index);
		var offset = link.offset();
		var s_top = offset.top;
		var s_middle = s_top + (link.outerHeight()/2);
		var s_left = offset.left;
		var s_bottom = s_top + link.outerHeight();
		var s_right = s_left + link.outerWidth();
		// console.log("s_top:"+s_top+",s_left:"+s_left+",s_bottom:"+s_bottom+",s_right:"+s_right);
		
		var textwrapper = $("#textwrapper_"+side);
		var blankwrapper = $("#blankwrapper_"+side);
		var textwrapper_top_offset = (textwrapper.outerHeight() - blankwrapper.outerHeight()) /2
		// console.log("textwrapper_top_offset:"+textwrapper_top_offset);
		var blankwrapper_top = blankwrapper.offset().top;

		
		var blank = $("#blank_"+side+index);
		var blank_offset = blank.offset();
		var e_top = blank_offset.top;
		var e_left = blank_offset.left;
		var e_middle = e_top + (blank.outerHeight()/2);
		var e_bottom = e_top + blank.outerHeight();
		var e_right = e_left + blank.outerWidth();
		// console.log("e_top:"+e_top+",e_left:"+e_left+",e_bottom:"+e_bottom+",e_right:"+e_right);
		
		if (start_y == "bottom") {
			sy = s_bottom-2;
		} else if (start_y == "middle") {
			sy = s_middle;
		}
		
		if (command == "create") { // CREATE LINE
			var variables = this.calculateLine(s_left, sy, e_left+10, s_bottom-2)
			line = this.createLineElement(side, index, variables[0], variables[1], variables[2], variables[3]);
			document.body.appendChild(line); 
		} else { // UPDATE LINE
			if (side == "R") {
				var variables = this.calculateLine(s_left-2, sy, e_left, e_bottom+textwrapper_top_offset);
			} else {
				var variables = this.calculateLine(s_right, s_middle, e_right, e_middle+textwrapper_top_offset);
			}
			line = document.getElementById('line_'+side+index);
			return this.updateLine(line, variables[0], variables[1], variables[2], variables[3]);
		}
	}

} /* END classHUD */

