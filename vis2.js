function Vis2(){
    angleMode(DEGREES);

    this.name = 'TestVis2';

    let balls = [];
    

    this.draw = function(){
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");
        let lowMid = fourier.getEnergy("lowMid");
        let mid = fourier.getEnergy("mid");
        let highMid = fourier.getEnergy("highMid");
        let treble = fourier.getEnergy("treble");
        let beatThisFrame = beatdetector.detectBeat(spectrum);

        let bgColor = 0;
        if(beatThisFrame)bgColor = 255;
        
        background(bgColor);
        stroke(255,0,0);

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
            fill(255,0,0);
            ellipse(x, y, D, D);
            //Inner circle
            fill(bgColor);
            ellipse(x, y, D*0.6, D*0.6);

            pop();

            let spawnBalls = [];
            // Spawn the balls(from 1 to 5) on beat;
            if(beatThisFrame){
                //Setup n of iterations
                let iter = Math.ceil(rightEnergy/51);
                for(let j = 0; j < iter; j++){
                    //Initialize and setup each ball
                    let ball = {};

                    ball.d = max(20, D/4);
                    ball.ang = randAng + j * 360/5;
                    ball.x1 = x + (D/2 + ball.d/2) * cos(ball.ang);
                    ball.y1 = y + (D/2 + ball.d/2) * sin(ball.ang);
                    ball.speed = Math.ceil(map(Math.random(), 0, 1, 1, 10));
                    ball.color = [(i%2 == 0) * rightEnergy, (j%2 == 0) * rightEnergy, (ball.speed < 5) * rightEnergy];

                    spawnBalls.push(ball);

                    push();
                    fill(ball.color);
                    ellipse(ball.x1, ball.y1, ball.d);
                    pop();
                }
            }
        }
    }
}