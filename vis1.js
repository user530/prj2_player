function Vis1(){
    this.name = 'TestVis1';
    let angle = 0;
    let r = 80;
    let stars = [];
    let starCount = 60;

    this.draw = function(){
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");

        push();
        angleMode(DEGREES);
        fill(255,0,0);
        strokeWeight(1);
        stroke(255,255,255);

        //Actions when beat detected        
        if(beatdetector.detectBeat(spectrum)){
            //Increase the r of the circle
            r = 120;

            //Setup N random angles for the stars, add new when needed
            if (stars.length < starCount){
                for(let i = stars.length; i < starCount; i++){
                    let star = {};
                    let randAng = Math.ceil(map(Math.random(), 0, 1, 0, 720)) * 360/720;
                    let randSp = Math.ceil()
                    star.ang = randAng;
                    stars.push(star);
                }
            }
        } 

        let points = [];
        //Draw a circle that changes on beat
        beginShape(POINTS);
        for(let i = 0; i < 720; i++){
            let ang = (angle + (i*360/720))%360;
            let x = width/2 + (r * cos(ang));
            let y = height/2 + (r * sin(ang));

            points.push([x,y]);

            vertex(x, y);

            //Check the angle against the angles of the stars
            for(let j = 0; j < stars.length; j++){
                //and if there no coordinates already
                if(ang == stars[j].ang && stars[j].x == undefined){
                    //set the coordinates of this point to the star
                    stars[j].x = x;
                    stars[j].y = y; 
                }
            }
        }
        endShape();

        //Draw the line from each point lines that represent spectrum
        for(let i = 0; i < points.length; i++){
            line(points[i][0],points[i][1],
                points[i][0] + (spectrum[i] * cos(angle + (i*360/points.length))),
                points[i][1] + (spectrum[i] * sin(angle + (i*360/points.length))))          
        }

        //Shoot the stars!
        for(let i = 0; i < stars.length; i++){
            //Draw the star
            point(stars[i].x, stars[i].y);
            //Move the star
                stars[i].x = stars[i].x + 10 * cos(stars[i].ang);
                stars[i].y = stars[i].y + 10 * sin(stars[i].ang);
            //Delete it when it leaves the screen
            if(stars[i].x < 0 || stars[i].x > width || stars[i].y < 0 || stars[i].y > height){
                stars.splice(i,1);
            }
        }

        //Rotate when bass energy is high
        if(bass>180) angle++
        
        //Decrease beat pulse
        if(r>80) r--
         
        pop();
    }
}