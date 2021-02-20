// Draw dancing snakeline and rotating blocks related to bass
function Snakeline(){

    this.name = 'Snake line';

    // Initialize variables
    let rotation = 0;
    let step = 0.1;
    let color = 255;

    // Function to initialize rotating blocks
    let rotatingBlocks = function(energy){

        // Setup blocks size and position increment
        let blockSide = map(energy, 0, 255, 20, 100);
        let incr = width/(10 - 1);

        push();
            // Move (0,0) to the center
            translate(width/2, height/2);

            // Increase rotation when energy is less than threshold
            if(energy != 0 && energy < 210){
                rotation += 0.1;    
            }
            
            // Rotate
            rotate(rotation);

            // Setup drawing settings
            color = [(frameCount%120 < 40) * 255,
                        (frameCount%120 >= 40 && frameCount%120 <= 80) * 255,
                            (frameCount%120 > 80) * 255]
            stroke(color);
            fill(color);
            rectMode('center');

            // Draw 10 blocks
            for(let i = 0 ; i < 10; i++){
                rect(i * incr - width/2, 0, blockSide, blockSide);
            }

        pop();
    }
    
    // Function to draw 
    let snakeLine = function(energy){

        // Setup small step
        let noiseStep = 0.001;

        // Draw line from points
        beginShape();
        for (let i = 0; i < 1000; i++){
            
            // Setup coordinates based on the pseudo-random noise function
            let x = width/2 + map(noise(i * noiseStep + step), 0, 1, - width/2, width/2);
            let y = height/2 + map(noise(i * noiseStep + step + 1000), 0, 1, -height/2, height/2);
            
            // Draw point from forementioned coordinates
            vertex(x, y);
        }
        endShape();

        // Increase step when energy is above threshold
        if (energy > 150){
        step += 0.01;
        }
    }

    // Draw this visualisation
    this.draw = function(){

        // Get required sound data
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");
        let lowMid = fourier.getEnergy("lowMid");
        let mid = fourier.getEnergy("mid");
        let highMid = fourier.getEnergy("highMid");
        let treble = fourier.getEnergy("treble");
        let beatThisFrame = beatdetector.detectBeat(spectrum);

        // Draw blocks
        rotatingBlocks(bass);

        // Draw snakeline
        snakeLine(bass);
        
}
}