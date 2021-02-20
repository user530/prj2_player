// Create firework explosions in the random parts of the screen
// WARNING: Can be hard on the eyes!

function Fireworks(){

    this.name = 'Fireworks (!SEIZURE WARNING!)';

    // Firework array
    let fireworks = [];

    noFill();
    stroke(255,255,255);
    strokeWeight(2);


    // Method to add new firework to the array
    let addFirework = function(){

        // Generate random color and random spawn position
        let f_color = color(random(0,255), random(0,255), random(0,255));
        let f_x = random(width*0.2, width*0.8);
        let f_y = random(height*0.2, height*0.8);

        // Add firework
        fireworks.push(new Firework(f_color, f_x, f_y));
    }

    // Draw fireworks and remove depleted ones
    let update = function(){
        for(let i = 0; i < fireworks.length; i++){
            fireworks[i].draw();
            if(fireworks[i].depleted){
                fireworks.splice(i,1);
            }
        }
    }

    // Draw fireworks
    this.draw = function(){

        // Songs spectrum
        let spectrum = fourier.analyze();

        // Beat detection
        let beatThisFrame = beatdetector.detectBeat(spectrum);

        // Add new fireworks on beat
        if(beatThisFrame) addFirework();

        // Draw fireworks and particles
        push();
            noStroke();
            update();
        pop();
    }
}