// Individual firework (related to fireworksVis.js)
function Firework(color, x, y){
    // It's color and coordinates
    let f_color = color;
    let f_x = x;
    let f_y = y;

    // Firework contains individual particles
    let particles = [];

    // Setup firework status
    this.depleted = false;

    // Generate 20 particles
    for(let i = 0; i < 360; i+=18){
        particles.push(new Particle(f_x, f_y, f_color, i, 3));
    }

    // Draw each particle and when all particles stop their movement change firework status to depleted
    this.draw = function(){
        for (let i = 0; i < particles.length; i++){
            particles[i].draw();

            if (particles[i].speed <= 0){
                this.depleted = true;
            }
        }
    }
}