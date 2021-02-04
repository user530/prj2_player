function Vis1(){
    this.name = 'TestVis1';
    
    this.draw = function(){
        push();
        angleMode(DEGREES);
        fill(255,0,0);
        strokeWeight(3);
        stroke(255,0,0);

        let r = 100;
        let angle = 0;

        beginShape(POINTS);
        for(let i = 0; i < 1024; i++){
            vertex(width/2 + r * cos(angle + (i * 360/1024)), height/2 + r * sin(angle + (i*360/1024)));
        }
        endShape();

        pop();
    }
}