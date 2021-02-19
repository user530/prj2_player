// Wrap the spectrum around circle, turn it when bass value is high, and shoot the stars on beat
function Vis1(){
    this.name = 'New Visual 1';
    let angle = 0;
    let r = 80;
    let stars = [];
    let starCount = 200;

    // Draw this visualisation
    this.draw = function(){

        // Get required sound data
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");

        // Setup drawing styles
        push();
        angleMode(DEGREES);
        fill(255,0,0);
        strokeWeight(1);
        stroke(255,255,255);

        //Actions when beat detected        
        if(beatdetector.detectBeat(spectrum)){
            //Increase the r of the circle
            r = 120;

            //Add stars on beat
            addStars(stars, starCount)
        
        } 

        let points = [];

        //Draw a circle that changes on beat
        beginShape(POINTS);
        for(let i = 0; i < 720; i++){
            //Calculate angle and coordinates
            let ang = (angle + (i*360/720))%360;
            let x = width/2 + (r * cos(ang));
            let y = height/2 + (r * sin(ang));

            //Update coordinates
            points.push([x,y]);

            //Draw point
            vertex(x, y);

            //Check the angle against the angles of the stars
            updateStars(stars, ang, x, y);
        }
        endShape();

        //Draw the line from each point lines that represent spectrum
        drawLines(points, spectrum, angle);

        //Shoot the stars!
        shootStars(stars);

        //Rotate when bass energy is high
        if(bass>180) angle++
        
        //Decrease beat pulse
        if(r>80) r--
         
        pop();
    }

    //Function to generate new stars
    let addStars = function(starArr, starCnt){
        //Setup N random angles for the stars, add new when needed
        if (starArr.length < starCnt){
            for(let i = starArr.length; i < starCnt; i++){
                //Initialize a star
                let star = {};
                //Set random angle and speed
                let randAng = Math.ceil(map(Math.random(), 0, 1, 0, 720)) * 360/720;
                let randSpd = Math.ceil(map(Math.random(), 0, 1, 1, 10));
                //Set attributes and save the star
                star.ang = randAng;
                star.spd = randSpd;
                starArr.push(star);
            }
        }
    }

    //Function to update star position based on its angle
    let updateStars = function(starArr, angle, xPos, yPos){
        for(let j = 0; j < starArr.length; j++){
            //and if there no coordinates already
            if(angle == starArr[j].ang && starArr[j].x == undefined){
                //set the coordinates of this point to the star
                starArr[j].x = xPos;
                starArr[j].y = yPos; 
            }
        }
    }

    //Function to draw lines based on the spectrum value
    let drawLines = function(pointsArr, spectrum, angle){
        for(let i = 0; i < pointsArr.length; i++){
            line(pointsArr[i][0],pointsArr[i][1],
                pointsArr[i][0] + (spectrum[i] * cos(angle + (i*360/pointsArr.length))),
                pointsArr[i][1] + (spectrum[i] * sin(angle + (i*360/pointsArr.length))))          
        }
    }

    //Function to draw and update stars
    let shootStars = function(starsArr){
        for(let i = 0; i < starsArr.length; i++){
            //Draw the star
            point(starsArr[i].x, starsArr[i].y);
            //Move the star
            starsArr[i].x = starsArr[i].x + starsArr[i].spd * cos(starsArr[i].ang);
            starsArr[i].y = starsArr[i].y + starsArr[i].spd * sin(starsArr[i].ang);
            //Delete it when it leaves the screen
            if(starsArr[i].x < 0 || starsArr[i].x > width || starsArr[i].y < 0 || starsArr[i].y > height){
                starsArr.splice(i,1);
            }
        }
    }
}