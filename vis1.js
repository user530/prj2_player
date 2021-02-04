function Vis1(){
    this.name = 'TestVis1';
    let angle = 0;
    let r = 80;
    this.draw = function(){
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");

        push();
        angleMode(DEGREES);
        fill(255,0,0);
        strokeWeight(1);
        stroke(255,0,0);

        if(beatdetector.detectBeat(spectrum)) r = 120;

        let arr = [];

        //Draw a circle that changes on beat
        beginShape(POINTS);
        for(let i = 0; i < 600; i++){
            let x = width/2 + (r * cos(angle + (i*360/600)));
            let y = height/2 + (r * sin(angle + (i*360/600)));

            arr.push([x,y]);

            vertex(x, y);
        }
        endShape();

        //Draw lines that represent spectrum
        for(let i = 0; i < arr.length; i++){
                line(arr[i][0],arr[i][1],
                    arr[i][0] + (spectrum[i] * cos(angle + (i*360/arr.length))),
                    arr[i][1] + (spectrum[i] * sin(angle + (i*360/arr.length))))
            
        }

        //Rotate when bass energy is high
        if(bass>225) angle++

        //Decrease beat pulse
        if(r>80) r--


        pop();
    }
}