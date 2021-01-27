function Spectrum(){
	this.name = "Spectrum";

	this.draw = function(){
		push();
		var spectrum = fourier.analyze();
		noStroke();
		
		// fill(0,255,0)
		for (var i = 0; i< spectrum.length; i++){
			
			fill(spectrum[i], 255 - spectrum[i], 0);
			
			// var x = map(i, 0, spectrum.length, 0, width);
			// var h = -height + map(spectrum[i], 0, 255, height, 0);
			// rect(x, height, width / spectrum.length, h );

			

			var x = map(spectrum[i], 0, 255, 0, width);
			var h = map(i, 0, spectrum.length, 0, height);
			rect(0, h, x, spectrum.length/height);
		    
  		}
	
		pop();
	};
}
