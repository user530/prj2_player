// Draw columns for the different values of the sound spectrum
function Spectrum(){
	this.name = "Spectrum";
	
	let lighting = {x: 0, y: height * 0.2, on: false};

	this.draw = function(){
		let spectrum = fourier.analyze();

		push();
			noStroke();
			//Move start position
			translate(width/2, height);

			//Setup size of the visualisation
			let wid = width*0.8;
			let heig = height*0.8;
			let scale = heig/255;

			//Number of rects in a column
			let vertNumb = 20;

			//Setup rect dimensions
			let w = wid/512;
			let h = heig/vertNumb;

			//Initial x
			let x = -wid/2;

			//Start builing columns
			for (let i = 0; i < 512; i++){
				//Number of rects in the column (scaled to the size)
				let n = Math.floor(spectrum[i] * scale/h);
				
				//Draw rects in the column
				for(let j = 0; j < n; j++){

					//Color based on the rect position
					let col = [0 + 255 * j/vertNumb, 
								255 - 255 * j/vertNumb,
									0];

					//Draw the rect and fill it
					push();
						fill(col);
						rect(x + w*i, -h * j, w, h);
					pop();
				};
			}; 
		pop();		
	};
};
