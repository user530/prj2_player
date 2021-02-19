// Draw wave pattern of the selected song
function WavePattern(){
	
	this.name = "Wave pattern";

	//Draw the wave form to the screen
	this.draw = function(){
		push();
			noFill();
			strokeWeight(2);
			stroke(255);


			beginShape();
			//Calculate the waveform from the fft.
			let wave = fourier.waveform();

			for (let i = 0; i < wave.length; i++){
					let color = map(wave[i], -1, 1, 0, 255);
					if(frameCount%5 == 0)stroke(color,255 - color, random (0, 255));

					/*For each element of the waveform map it to screen 
					coordinates and make a new vertex at the point.*/
					let x = map(i, 0, wave.length, 0, width);
					let y = map(wave[i], -1, 1, 0, height);

					vertex(x, y);
			}

			endShape();
		pop();
	};
}
