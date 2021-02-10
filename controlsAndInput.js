//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){
	
	//Show control info for the first time
	let info = 1;

	this.menuDisplayed = false;
	
	//Fullscreen mode button displayed in the bottom right of the screen
	this.fullscreenButton = new FullscreenButton();

	//make the window fullscreen or revert to windowed
	this.mousePressed = function(){

		//check if the fullscreen mode button has been clicked
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

		if(keycode > 48 && keycode < 58){
			var visNumber = keycode - 49;
			vis.selectVisual(vis.visuals[visNumber].name); 
		}
	};

	//draws the playback button and potentially the menu
	this.draw = function(){
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textSize(34);

		//Fullscreen button
		this.fullscreenButton.draw();

		//only draw the menu if menu displayed is set to true.
		if(this.menuDisplayed){
			text("Select a visualisation:", 80, 30);
			this.menu();
		}

		//show control button at the start
		if (info == 1) text("Press the 'Space' button to open the visualisation menu", 80, 30);
		pop();

	};

	this.menu = function(){
		//draw out menu items for each visualisation
		for (let i = 0; i < vis.visuals.length; i++)
		{
			text((i + 1) + ". " + vis.visuals[i].name, 100, 70 + i * 40);
		}

	};
}


