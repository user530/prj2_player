// Draw wave pattern of the selected song
function WavePattern(){
	
	this.name = "Wave pattern";

	let color = 255;

	//Draw the wave form to the screen
	this.draw = function(){
	
		// Get required sound data
		let spectrum = fourier.analyze();
		let wave = fourier.waveform();
		let beatThisFrame = beatdetector.detectBeat(spectrum);

		push();
			noFill();
			strokeWeight(2);
			stroke(color);

			for (let i = 0; i < wave.length; i+=3){
				if(beatThisFrame){
					color = [(spectrum[i]%255 < 50) * 255,
									(spectrum[i]%255 >= 50 && spectrum[i]%255 < 100) * 255,
										(spectrum[i]%255 > 150) * 255];
				}
				
				stroke(color);

				// Setup x an y coordinates based on the wave value;
				let x = map(i, 0, wave.length, 0, width);
				let y = map(wave[i], -1, 1, height * 0.1, height * 0.9);

				line(x, height - y, x, y);
			}
		pop();
	};
}