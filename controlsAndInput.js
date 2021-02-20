//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){

	//Show control info for the first time
	let info = 1;

	// Menu visibility state
	this.menuDisplayed = false;
	
	//Fullscreen (not real fullscreen) mode button displayed in the bottom right of the screen
	this.fullscreenButton = new FullscreenButton();

	//Make the window fullscreen or revert to windowed
	this.mousePressed = function(){

		//Check if the fullscreen mode button has been clicked
		if(this.fullscreenButton.hitCheck())
		{
			this.fullscreenButton.resize()
		}
		
	};

	//responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	this.keyPressed = function(keycode){
		if(keycode == 32){
			//Toggle menu
			this.menuDisplayed = !this.menuDisplayed;
			//Disable info
			info = 0;
		}
		//Select appropriate visualisation
		if(keycode > 48 && keycode < 58){
			var visNumber = keycode - 49;
			vis.selectVisual(vis.visuals[visNumber].name); 
		}
	};

	//Draws the playback button and potentially the menu
	this.draw = function(){
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);

		// Get canvas element width for adjustable text size;
		let canWid = canvas.style.width.substring(0,canvas.style.width.indexOf('p'));

		// Adjustable text size
		textSize(canWid*0.035);

		//Fullscreen button
		this.fullscreenButton.draw();

		//Only draw the menu if menu displayed is set to true.
		if(this.menuDisplayed){
			text("Select a visualisation:", width * 0.05, height * 0.05);
			this.menu(canWid);
		}

		//Show control button at the start
		if (info == 1) text("Press the 'Space' button to open the visualisation menu", width * 0.05, height * 0.05);
		pop();

	};

	// Draw available visualisations
	this.menu = function(w){
		//Draw out menu items for each visualisation
		for (let i = 0; i < vis.visuals.length; i++)
		{
			text((i + 1) + ". " + vis.visuals[i].name, 100, w * (0.075 + i * 0.038));
		}
	};
}


