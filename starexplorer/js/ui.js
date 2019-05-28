

// classUI.prototype.itemSelected = function(callback) {
    // // Call our callback, but using our own instance as the context
    // callback.call(this);
// }

function classUI() {
	
	this.selected_item = "";
	this.space = new classSpace(this);
	this.hud = new classHUD(this);
	var space = this.space;
	var ui = this;
	
	this.init = function() {
		// INIT HUD
		this.hud.init();
		// HIGHLIGHT PANEL BUTTONS
		this.highlightTopButtonColor(".fs-hud", "#8f99ba");
		this.highlightTopButtonColor(".fs-panels", "#8f99ba");
		this.highlightTopButtonColor(".fs-sound", "#8f99ba");
		this.highlightButtonColor('.fs-planet')
		this.highlightViewButtonColor(".fs-sideview");
		// RESET SELECTOR
		$('#selector').val('');
		// SET LISTENERS
		$(window).on('resize', ui.onWindowResize);
		$(document).keyup(function(e) {documentKeyUp(e);});
		$(document).mousedown(function(event) {ui.showPanels(event);});
		// $('#selector').on('change', function() {selectorOnChange();})
		$(".textcontainer").on("mousedown click", "a", function (e) {ui.linkClicked(e);} );
		$('#textcontainer_L').mousedown(function(e) {ui.HUDLmousedown(e);});
		$('#textcontainer_R').mousedown(function(e) {ui.HUDRmousedown(e);});
		$('.fs-hud').on('click', function() {ui.toggleHUD();});
		$('.fs-panels').on('click', function() {ui.hidePanels();});
		$('.fs-sound').on('click', function() {ui.toggleSound();});
		$('.fs-orbit').on('click', function() {ui.showOrbitClicked();});
		$('.fs-planet').on('click', function() {ui.showPlanetClicked();});
		$(".fs-topview").click(function() {ui.showTopViewClicked();});
		$(".fs-sideview").click(function() {ui.showSideViewClicked();});
		$(".fs-hover").click(function() {ui.showHoverClicked();});
		$(".fs-compare").click(function() {ui.showCompareClicked();});
		$('#selector_button').on('click', function() {ui.selectorButtonClicked();})
		$('.selector_item').on('click', function() {ui.selectorItemClicked(this);})
		$('#sun').on('click', function() {ui.showPlanetClicked("sun");})
		$('#mercury .planet').on('click', function() {ui.showPlanetClicked("mercury");})
		$('#venus .planet').on('click', function() {ui.showPlanetClicked("venus");})
		$('#earth .planet').on('click', function() {ui.showPlanetClicked("earth");})
		$('#moon .planet').on('click', function() {ui.showPlanetClicked("moon");})
		$('#mars .planet').on('click', function() {ui.showPlanetClicked("mars");})
		$('#jupiter .planet').on('click', function() {ui.showPlanetClicked("jupiter");})
		$('#saturn .planet').on('click', function() {ui.showPlanetClicked("saturn");})
		$('#uranus .planet').on('click', function() {ui.showPlanetClicked("uranus");})
		$('#neptune .planet').on('click', function() {ui.showPlanetClicked("neptune");})
	}

	this.update = function() {
		if (this.hud.visible) {
			ui.hud.LUpdate();
			ui.hud.RUpdate();
		}
	}
	
	this.onWindowResize = function() {
		ui.update();
	}
	
	this.documentKeyUp = function() {
		if (e.keyCode === 27) {
			$('.panel').toggle();
		}
	}
	
	this.showHoverClicked = function() {
		this.hideMenu(); 
		this.highlightButtonColor('.fs-hover');
		$("h1").html(toProperCase(ui.space.object_name));
		space.showHover();
	}
	
	this.showSideViewClicked = function() {
		this.hideMenu(); 
		this.highlightViewButtonColor('.fs-sideview');
		space.showSideView()
	}
	
	this.showTopViewClicked = function() {
		this.hideMenu(); 
		this.highlightViewButtonColor('.fs-topview');
		space.showTopView();
	}
	
	this.showPlanetClicked = function(iobject_name) {
		if (typeof iobject_name !== "undefined") space.object_name = iobject_name;
		this.hideMenu(); 
		this.highlightButtonColor('.fs-planet');
		$("h1").html(toProperCase(space.object_name));
		$("#selector_label").html(space.object_name.toUpperCase());
		if ((this.hud.visible) || (typeof this.hud.visible === "undefined")) {
			$(".line").show();
			$(".textcontainer").show();
		}
		space.showPlanet(space.object_name);
	}
	
	this.showOrbitClicked = function() {
		this.hideMenu(); 
		this.highlightButtonColor('.fs-orbit');
		this.space.showOrbit();
	}
	
	this.showCompareClicked = function() {
		this.hideMenu(); 
		this.highlightButtonColor('.fs-compare');
		this.space.showCompare();
	}
	
	this.showPanels = function(e) {
		switch (e.which) {
			case 3:
				$(".panel").show(); 
				this.highlightTopButtonColor(".fs-panels", "#8f99ba");
				audioPlay("button-click"); 
				break;
		}
	}
	
	this.highlightViewButtonColor = function(className) {
		$('.fs-sideview').css("color","#aaa");
		$('.fs-topview').css("color","#aaa");
		$(className).css("color","#a5daba");
		}
	
	this.highlightButtonColor = function(className) {
		$('.fs-orbit').css("color","#aaa");
		$('.fs-planet').css("color","#aaa");
		$('.fs-compare').css("color","#aaa");
		$('.fs-hover').css("color","#aaa");
		$(className).css("color","rgb(182, 173, 216)");
	}
	
	this.linkClicked = function(e) {
		window.location.href = this.href;
		e.preventDefault();
		e.stopPropagation();
	}
	
	this.HUDLmousedown = function(e) {
		switch (e.which) {
			case 1:
				ui.hud.LNext();
				audioPlay("hud-click"); 
			case 2:
				break;
			case 3:
				ui.hud.LBack();
				audioPlay("hud-click"); 
				break;
		}
		e.preventDefault();
		e.stopPropagation();
	}
	
	this.HUDRmousedown = function(e) {
		switch (e.which) {
			case 1:
				ui.hud.RNext();
				audioPlay("hud-click"); 
			case 2:
				break;
			case 3:
				ui.hud.RBack();
				audioPlay("hud-click"); 
				break;
		}
		e.preventDefault();
		e.stopPropagation();
	}
	
	this.toggleHUD = function(e) {
		if ($('#universe').is(":hidden")) {
			if ((ui.hud.visible) || (typeof ui.hud.visible === "undefined")) {
				ui.hud.visible = false;
				this.highlightTopButtonColor(".fs-hud", "#aaa");
				$('#textcontainer_R').hide();
				$('#textcontainer_L').hide();
				$('.line').hide();
				$('h1').hide();
			}
			else {
				
				ui.hud.visible = true;
				this.highlightTopButtonColor(".fs-hud", "#8f99ba");
				ui.hud.loadInfoAndStats(space.object_name);
				// $('#textcontainer_R').show();
				// $('#textcontainer_L').show();
				$('.line').show();
				$('h1').show();
			}
			audioPlay("button-click");
		}
	}
	
	this.hidePanels = function() {
		$(".panel").hide(); 
		this.highlightTopButtonColor(".fs-panels", "#aaa");
		audioPlay("button-click"); 
	}
	
	this.toggleSound = function() {
		if (soundon) {
			soundon = false;
			this.highlightTopButtonColor(".fs-sound", "#aaa");
			snd1.pause();
			snd2.pause();
		} else {
			soundon = true;
			this.highlightTopButtonColor(".fs-sound", "#8f99ba");
			snd1.play();
			snd2.play();
		}
		audioPlay("button-click"); 
	}
	
	this.highlightTopButtonColor = function(className, color) {
		$(className).css("color", color);
	}
	
	this.hideMenu = function() {
		$('.selector').css('bottom', '-550px');
	}
	
	this.selectorButtonClicked = function() {
		audioPlay("screen"); 
		console.log(parseInt($('.selector').css('bottom')));
		if (parseInt($('.selector').css('bottom')) < 0) {
			$('.selector').css('bottom', '0px');
			$('.selector').css('width', '300px');
		}
		else {
			$('.selector').css('bottom', '-550px');			
		}
	}
	
	this.selectorItemClicked = function(item) {
		var value = $(item).data("value");
		// console.log($(this).data("value"));
		// $(this).addClass("selected");
		
		//this.callback.call(value);
		selectedItemChanged(value);
		// HIDE MENU
		// alert('4');
		$('.selector').css('bottom', '-550px');
		// event.preventDefault();
	}
	
	function selectedItemChanged(value) {
		// object_name = value;
		// if ($('#universe').is(":hidden")) {
			// drawObject(value);
		// }
		// // SELECT 3DCssSolarSystem
		// select3DCssSolarSystem(value);
		
		if ((value != space.object_name) && (typeof value !== "undefined")) {
			$("h1").html(toProperCase(value));
			audioPlay("beep"); 
			// alert('test');
			if ($('#universe').is(":hidden")) {
				space.drawObject(value);
				// alert('1');
			}
			// SELECT 3DCssSolarSystem
			space.select3DCssSolarSystem(value);
			// alert('2');
			
			$('#selector_label').html(space.object_name.toUpperCase());
			// alert('3');
		}
	}
	
	function toProperCase(str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
}