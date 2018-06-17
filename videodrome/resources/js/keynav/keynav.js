/*!
 * Keynav
 * http://github.com/p5yb14d3/keynav
 *
 * Copyright (c) 2018, p5yb14d3
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://github.com/p5yb14d3/keynav/LICENSE
 *
 */

// INITIALIZE KEYNAV
$(document).ready(function() {
	// KEYBOARD INIT
	keynav.init($("li"), $('#container2'));
});

// HANDLES SELECTION CONFIRMATION. THIS FUNCTION IS CALLED FROM THE ELEMENT.
function confirm_selection() {
	window.location.href = keynav.liSelected.children('div').data('href');
}

// HANDLES WINDOW RESIZE
$(window).on('resize', function(){
	keynav.init($("li"), $('#container2'));
});

// HANDLES KEYDOWN
$(window).keydown(function(e){
	currentMousePos.x_old = currentMousePos.x;
    currentMousePos.y_old = currentMousePos.y;
	
	$("li").removeClass("hover");
	
	// DOWN
	if(e.which === 40) {
		keynav.down(e);
		audio_hover.play();
		e.preventDefault();
	}
	// UP
	else if(e.which === 38) {
		keynav.up(e);
		audio_hover.play();
		e.preventDefault();
	}
	// RIGHT
	else if (e.which === 39) {
		keynav.right(e);
		audio_hover.play();
		e.preventDefault();
	}
	// LEFT
	else if (e.which === 37) {
		keynav.left(e);
		audio_hover.play();
		e.preventDefault();
	}
	// ENTER
	else if (e.which === 13) {
		audio_click.play();
	}
	// ESCAPE
	else if (e.which === 27) { 
		audio_back.play();
	}
});

// CLASS KEYNAV
var keynav = new function() {
	this.li;
	this.liSelected;
	this.container;
	this.page_offset_top;
	this.scroll_new = 0;
	this.scroll_old = 0;
	
	this.cols = 0;
    this.rows = 0;
	this.items_count = 0;
	this.col_marked = -1;
	this.position_current = 0;
	this.position_last_item = -1;
	this.position_second_last_row_last_item = 0;
	this.last_row_items_count = 0;
	
    this.init = function (list, container) {
		this.li = list;
		this.container = container;
		this.page_offset_top = this.li.eq(0).children('div').offset().top - this.container.offset().top + this.container.scrollTop();
		
		// CALCULATE VARIABLES
		this.cols = this.countCols(this.li);
		// console.log("number of cols:" + this.cols);
		
		this.rows = Math.ceil(this.li.length/this.cols);
		// console.log("number of rows:" + this.rows);
		this.position_second_last_row_last_item = ((this.rows-1) * this.cols)-1;
		// console.log('position_second_last_row_last_item:'+this.position_second_last_row_last_item);
		
		this.items_count = this.li.length;
		this.position_last_item = this.items_count-1;
		// console.log('items_count:'+this.items_count);
		
		this.last_row_items_count = this.items_count % this.cols;
		if (this.last_row_items_count == 0) this.last_row_items_count = this.cols;
		// console.log("last_row_items_count = "+this.last_row_items_count);
		
		// HIGHLIGHT INITIAL SELECTION
		if (!this.liSelected) {
			this.liSelected = this.li.first();
			this.highlightItem();
			}
    };
	
	// COUNT NUMBER OF COLOUMS IN A ROW
	this.countCols = function (e) {
		var count = 0;
		$(e).each( function() {
			if ($(this).prev().length > 0) {
				if ($(this).position().top != $(this).prev().position().top) {
					return false;
					}
				count++;
			}
			else {
				count++;   
			}
		});
		return count;
	}
	
	// CHECK IF IS SECOND LAST ROW
	this.isSecondLastRow = function() {
		if ((this.absolutePosition() <= (this.items_count - this.last_row_items_count)) && (this.position_current >= (this.items_count - this.last_row_items_count - this.cols))) {
			// console.log((this.items_count - this.last_row_items_count - this.cols)+"<"+this.absolutePosition()+"<"+(this.items_count - this.last_row_items_count)+" = true");
			return true;
		}
		else {
			// console.log((this.items_count - this.last_row_items_count - this.cols)+"<"+this.absolutePosition()+"<"+(this.items_count - this.last_row_items_count)+" = false");
			return false;
		}
	}
	
	// CHECK IF IS LAST ROW
	this.isLastRow = function() {
		if ((this.absolutePosition() <= (this.items_count)) && (this.position_current >= (this.items_count - this.last_row_items_count))) {
			// console.log("Is LastRow = " + (this.items_count - this.last_row_items_count)+"<"+this.absolutePosition() +"<"+(this.items_count)+" = True");
			return true;
		}
		else {
			// console.log("Is LastRow = " + (this.items_count - this.last_row_items_count)+"<"+this.absolutePosition() +"<"+(this.items_count)+" = False");
			return false;
		}
	}
	
	// CHECK IF IS NOT LAST ROW
	this.isNotLastRow = function() {
		return !this.isLastRow();
	}
	
	// CHECK IF IS FIRST ROW
	this.isFirstRow = function() {
		if (this.absolutePosition() <= this.cols) {
			// console.log('isFirstRow = (position_cur:' + this.position_current+"-1) <= cols:"+this.cols+" = True");
			return true;
		}
		else {
			// console.log('isFirstRow = (position_cur:' + this.position_current+"-1) <= cols:"+this.cols+" = False");
			return false;
		}
	}
	
	// CHECK IF IS COLOUM MARKED
	this.isColMarkedDefined = function() {
		if (this.col_marked != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS LAST ITEM
	this.isLastItem = function() {
		if ((this.position_current + 1) == this.items_count) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS NOT LAST ITEM
	this.isNotLastItem = function() {
		return !this.isLastItem();
	}
	
	// CHECK IF IS FIRST ITEM
	this.isFirstItem = function() {
		if ((this.position_current) == 0) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS NOT FIRST ITEM
	this.isNotFirstItem = function() {
		return !this.isFirstItem();
	}
	
	// MOVE TO FIRST ROW
	this.moveToFirstRow = function() {
		if (this.isColMarkedDefined()) {
			this.position_current = this.col_marked - 1;
		}
		else {
			this.position_current = this.currentCol()-1;
		}
	}
	
	// MOVE TO LAST ROW
	this.moveToLastRow = function() {
		var last_row_new_col = (this.currentCol() / this.cols) * this.last_row_items_count;
		// console.log('last_row_new_col = (currentCol:'+this.currentCol()+' / last_row_items_count:'+this.last_row_items_count+') = '+last_row_new_col+' ==> Math.ceil(last_row_new_col):'+(Math.ceil(last_row_new_col)));
		this.position_current = (this.position_last_item - (this.last_row_items_count - (Math.ceil(last_row_new_col)+1)))-1;
	}
	
	// MOVE TO SECOND LAST ROW
	this.moveToSecondLastRow = function() {
		// console.log("moveToSecondLastRow: pos_cur:"+this.position_current+" - cols:"+this.cols+" = "+(this.position_current - this.cols));
		var new_col = this.currentCol() / this.cols;
		// console.log('new_col:'+new_col+'... Math.ceil(new_col):'+Math.ceil(new_col));
		var items_per_division = Math.floor(this.cols / this.last_row_items_count);
		// console.log('items_per_division:'+items_per_division);
		var last_row_half_point_measure = (this.currentCol() / this.last_row_items_count);
		// console.log('last_row_half_point_measure:'+last_row_half_point_measure);
		var item_start_point =  ((items_per_division * this.currentCol()));
		// console.log('item_start_point:'+item_start_point);
		if (last_row_half_point_measure > 0.5) {
			// console.log('bigger than halfpoint');
			var position_new_col = this.position_second_last_row_last_item - (this.cols - item_start_point) - (items_per_division-1);
			// console.log('position_new_col:'+position_new_col);
		}	
		else {
			// console.log('smaller than halfpoint');
			var position_new_col = this.position_second_last_row_last_item - (this.cols - item_start_point);
			// console.log('position_new_col:'+position_new_col);
		}
		this.position_current = position_new_col;
	}
	
	// MOVE UP
	this.moveUp = function() {
		// console.log(this.currentCol()+","+this.last_row_items_count);
		this.position_current = this.position_current - this.cols;
		this.rememberCol();
	}
	
	// MOVE DOWN
	this.moveDown = function() {
		// console.log(this.currentCol()+","+this.last_row_items_count);
		this.rememberCol();
		this.position_current = this.position_current + this.cols;
	}
	
	// MOVE RIGHT
	this.moveRight = function() {
		this.position_current = this.position_current + 1;
		this.rememberCol();
	}
	
	// MOVE LEFT
	this.moveLeft = function() {
		this.position_current = this.position_current - 1;
		this.rememberCol();
	}
	
	// MOVE TO FIRST ITEM
	this.moveToFirstItem = function() {
		this.container.scrollTop(0);
		this.position_current = 0;
	}
	
	// MOVE TO LAST ITEM
	this.moveToLastItem = function() {
		this.position_current = this.position_last_item;
	}
	
	// GET ABSOLUTE POSITION
	this.absolutePosition = function() {
		return this.position_current+1;
	}
	
	// GET CURRENT COLOUM
	this.currentCol = function() {
		// console.log("current_col = position_cur:"+ this.position_current+" % cols:"+this.cols  +"+1 = "+((this.position_current % this.cols)+1));
		return (this.position_current % this.cols) + 1;
	}
	
	// REMEMBER CURRENT COLOUM
	this.rememberCol = function() {
		this.col_marked = this.currentCol();
	}
	
	// DEHIGHLIGHT ITEM BY REMOVING CSS CLASS 'selected'
	this.deHighlightItem = function() {
		if (this.liSelected !== undefined) {
			this.liSelected.removeClass('selected');
		}
	}

	// HIGHLIGHT ITEM BY ADDING CSS CLASS 'selected'
	this.highlightItem = function() {
		this.liSelected.addClass('selected');
	}
	
	// SET liSelected TO CURRENT POSITION
	this.setLISelectedToCurrentPosition = function(li) {
		this.deHighlightItem();
		if (li !== undefined) { // EQUATE IT TO GIVEN PARAMETER
			this.liSelected = li;
		}
		else { // EQUATE IT TO CURRENT POSITION
			this.liSelected = this.li.eq(this.position_current);
		}
		this.highlightItem();
	}
	
	// CHECK IF ITEM IS OUT OF VIEWPORT
	this.isItemOutOfViewPort = function() {
		return (((this.liSelected.position().top + this.liSelected.height()) > window.innerHeight) || (this.liSelected.position().top < 0));
	}
	
	// SCROLL TO VIEW FOR UP AND LEFT
	this.scrollToView = function() {
		if (this.isItemOutOfViewPort()) {
			// console.log('00: scroll_new:'+this.scroll_new+', scroll_old:'+this.scroll_old);
			this.scroll_new = this.liSelected.children('div').offset().top - this.container.offset().top + this.container.scrollTop();
			this.container.scrollTop(this.scroll_new - this.page_offset_top);
			this.scroll_old = this.scroll_new;
		}
	}
	
	// SCROLL TO VIEW FOR DOWN AND RIGHT
	this.scrollToView2 = function() {
		this.scroll_new = this.liSelected.children('div').offset().top - this.container.offset().top + this.container.scrollTop();
		if ((this.scroll_new > this.scroll_old)) {
			// console.log('11: scroll_new:'+this.scroll_new+', scroll_old:'+this.scroll_old);
			this.container.scrollTop(this.scroll_old - this.page_offset_top);
			this.scroll_old = this.scroll_new;
		}
		else if (this.isItemOutOfViewPort()) {
			// console.log('22: scroll_new:'+this.scroll_new+', scroll_old:'+this.scroll_old);
			this.container.scrollTop(this.scroll_new - this.page_offset_top);
			this.scroll_old = this.scroll_new;
		}
		else {
			// console.log('33: scroll_new:'+this.scroll_new+', scroll_old:'+this.scroll_old);
			this.scroll_old = this.scroll_new;
		}
	}
	
	// KEYNAV DOWN
	this.down = function (e) {
		if (this.isLastRow()) {
			this.moveToFirstRow();
		}
		else if (this.isSecondLastRow()) {
			this.moveToLastRow();
		}
		else {
			this.moveDown();
		}
		
		this.setLISelectedToCurrentPosition();
		
		this.scrollToView2();

	};
	
	// KEYNAV UP
	this.up = function(e) {
		if (this.isFirstRow() && this.isSecondLastRow()) {
			this.moveToLastRow();
		}
		else if (this.isFirstRow() && this.isLastRow()) {
			this.moveToLastRow();
		}
		else if (this.isLastRow()) {
			this.moveToSecondLastRow();
		}
		else if (this.isFirstRow()) {
			this.moveToLastRow();
		}
		else {
			this.moveUp();
		}
		
		this.setLISelectedToCurrentPosition();
		
		this.scrollToView();
	};
	
	// KEYNAV RIGHT
	this.right = function(e) {
		if (this.isNotLastItem()) {
			this.moveRight();
		}
		else {
			this.moveToFirstItem();
		}
		
		this.setLISelectedToCurrentPosition();
		
		this.scrollToView2();
	};
	
	// KEYNAV LEFT
	this.left = function(e) {
		if(this.isNotFirstItem()){
			this.moveLeft();
		}
		else {
			this.moveToLastItem();
		}

		this.setLISelectedToCurrentPosition();
		
		this.scrollToView();
	};
}


