//draw the waveform to the screen
function WavePattern(){
	//vis name
	this.name = "Wave pattern";

	//draw the wave form to the screen
	this.draw = function(){
		push();
		noFill();
		// stroke(255, 0, 0);
		

		strokeWeight(2);

		beginShape();
		//calculate the waveform from the fft.
		var wave = fourier.waveform();

		for (var i = 0; i < wave.length; i++){
			let color = map(wave[i], -1, 1, 0, 255);
			stroke(color,255 - color, random (0, 255));
			//for each element of the waveform map it to screen 
			//coordinates and make a new vertex at the point.
			var x = map(i, 0, wave.length, 0, width);
			var y = map(wave[i], -1, 1, 0, height);

			vertex(x, y);
		}

		endShape();
		pop();
	};
}
