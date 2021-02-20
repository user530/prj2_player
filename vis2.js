// Please be carefull, alot of bright flashes!
// Create 5 energy nodes that spawn colorfull balls that bounce along the screen borders and explode on collision causing background flash 
function Vis2(){
    angleMode(DEGREES);

    this.name = 'New Visual 2 (!SEIZURE WARNING!)';

    let balls = [];
    let bgColor = 0;

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

        // Setup drawing styles
        background(bgColor);
        stroke(255);

        // Create energy nodes
        createNodes(bass, lowMid, mid, highMid, treble, beatThisFrame);
        
        // Draw balls
        drawBalls();
    }

    //Function to create nodes that spawn balls
    let createNodes = function(bass, lowMid, mid, highMid, treble, beat){

        //Draw the energy nodes for the song
        for(let i = 0; i < 5; i++){

            //Setup the nodes that they will make the pattern;
            let x = (i%3 == 0) * width/4 + (i%3 == 1) * width * 3/4 + (i%3 == 2) * width/2;
            let y = (i < 2) * height/4 + (i > 2) * height * 3/4 + (i == 2) * height/2;
            let rightEnergy = (i%5 == 0)*bass + (i%5 == 1)*lowMid + (i%5 == 2)*mid +
                                (i%5 == 3)*highMid + (i%5 == 4)*treble;
            let D = map(rightEnergy, 0, 255, 40, 200);
            let randAng = Math.ceil(map(Math.random(), 0, 1, 0, 360));

            //Stylize the nodes;
            push();
                //Outer circle
                stroke(0);
                fill(255);
                ellipse(x, y, D, D);
                
                //Inner circle
                fill(bgColor);
                ellipse(x, y, D*0.6, D*0.6);
            pop();

            // Spawn the balls(from 1 to 5) on beat;
            if(beat){

                //Setup n of iterations
                let iter = Math.ceil(rightEnergy/51);

                for(let j = 0; j < iter; j++){

                    //Initialize and setup each ball
                    let ball = {};

                    ball.d = max(20, D/8);
                    ball.ang = randAng + j * 360/5;
                    ball.x1 = x + (D/2 + ball.d/2) * cos(ball.ang);
                    ball.y1 = y + (D/2 + ball.d/2) * sin(ball.ang);
                    ball.speed = Math.ceil(map(Math.random(), 0, 1, 1, 10));
                    ball.color = [(i%2 == 0) * rightEnergy, (j%2 == 0) * rightEnergy, (frameCount%2 == 1) * rightEnergy];

                    //Add this ball to array
                    balls.push(ball);
                }
            }
        }
    }

    //Function to draw balls
    let drawBalls = function(){

        //Iterate over all balls
        for(let i = 0; i < balls.length; i++){

            //Draw ball
            push();
            stroke(255);
            fill(balls[i].color);
            ellipse(balls[i].x1, balls[i].y1, balls[i].d);
            pop();

            //Update balls x coordinate
            let vectX = balls[i].speed * cos(balls[i].ang)

                //Check if ball moves to the right
            if(cos(balls[i].ang) > 0){
                
                //Move ball to the right but within bounds
                balls[i].x1 += min(vectX, width - (balls[i].x1 + balls[i].d/2));
            }
            //Check if ball moves to the left
            else{

                //Move ball to the left but within bounds
                balls[i].x1 += max(vectX, -balls[i].x1 + balls[i].d/2);
            }

            //Update balls y coordinate
            let vectY = balls[i].speed * sin(balls[i].ang);

                //Check if ball moves to the top
            if(sin(balls[i].ang) < 0){

                //Move ball to the top but within bounds
                balls[i].y1 += max(vectY, -balls[i].y1 + balls[i].d/2);
            }
                //Check if ball moves to the bottom
            else{
                //Move ball to the bottom but within bounds
                balls[i].y1 += min(vectY, height - (balls[i].y1 + balls[i].d/2));
            }

            //Check if ball reached right/left -> reflect it
            if (balls[i].x1 - balls[i].d/2 == 0 || balls[i].x1 + balls[i].d/2 == width){
                balls[i].ang = 180 - balls[i].ang;
            }

            //Check if ball reached top/down -> reflect it
            if (balls[i].y1 - balls[i].d/2 == 0 || balls[i].y1 + balls[i].d/2 == height){
                balls[i].ang = - balls[i].ang;
            }

            //Delete the balls that out of bound (when screen is resized)
            if(balls[i].x1 - balls[i].d/2 > width || balls[i].x1 + balls[i].d/2 < 0 ||
                balls[i].y1 - balls[i].d/2 > height || balls[i].y1 + balls[i].d/2 < 0){
                    balls.splice(i, 1);
                }

            // For each ball check the collision
            for(let j = i + 1; j < balls.length; j++){

                //Check balls collision
                if(dist(balls[i].x1, balls[i].y1, 
                    balls[j].x1, balls[j].y1) <= (balls[i].d + balls[j].d)/2){

                        // Background flash on collision
                        bgColor = balls[i].color;

                        // Erase collided balls
                        balls.splice(i, 1);
                        balls.splice(j - 1, 1);
                }
            }
        }
    }
}