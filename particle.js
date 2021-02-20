// Handles particles of each individual firework (related to firework.js)
function Particle(x, y, color, angle, speed){
    
    // Setup initial position color and angle 
    let p_x = x;
    let p_y = y;
    let p_color = color;
    let p_angle = angle;

    // Speed of the particle
    this.speed = speed;

    // Move and draw each particle
    this.draw = function(){
        // Move particle
        update();

        // Color and draw particle
        fill(p_color);
        ellipse(p_x, p_y, 5, 5);
    }

    // Slow particle down a little and change it position on the screen
    function update(){
        this.speed -= 0.01;

        p_x += speed * cos(p_angle);
        p_y += speed * sin(p_angle);
    }
}