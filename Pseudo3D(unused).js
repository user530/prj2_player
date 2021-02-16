//Idea for this algorithm is inspired by 
//https://www.lexaloffle.com/bbs/?tid=35767
function Vis3(){
    this.name = 'TestVis3';

    frameRate(60);

    // let track = [{segCount: 3000, segTurn: 0},
    // {segCount: 3000, segTurn: -1},
    // {segCount: 3000, segTurn: 0},
    // {segCount: 3000, segTurn: 1.5},
    // {segCount: 3000, segTurn: 0.2},
    // {segCount: 3000, segTurn: 0},
    // {segCount: 3000, segTurn: -1}];

    //Setup the track
    let track;

    //Setup the camera
    let cam;
    
    //Setup the camera starting section and segment
    let camSect;
    let camSegm; 
    //Setup current starting section and segment
    let curSection;
    let curSegment;


    //Function to initialize starting position
    let reset = function(){
        //Reset the track
        track = [
            {segCount: 3600, segTurn: 0}
        ];
    
        //Reset the camera
        cam = {x: 0, y: 0, z: 0};
        
        //Reset the camera starting section and segment
        camSect = 0;
        camSegm = 0; 
        //Reset current starting section and segment
        curSection = camSect;
        curSegment = camSegm;
    }

    reset();

    this.draw = function(){
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");
        let lowMid = fourier.getEnergy("lowMid");
        let mid = fourier.getEnergy("mid");
        let highMid = fourier.getEnergy("highMid");
        let treble = fourier.getEnergy("treble");
        let beatThisFrame = beatdetector.detectBeat(spectrum);

        
        push();
        translate(width/2, 0);
        fill(255);
        stroke(255);

        if(curSong.isPlaying()){
            let avgEng;
            let engSum = 0;

            for(let i = 0; i < spectrum.length; i++){
                engSum += spectrum[i]
            }

            avgEng = engSum/spectrum.length;

            let turn = map(avgEng, 0, 255, 0, 0.5);

            for(let i = 0; i < 30; i++){
                let turnDel = turn * (i - (i > 15) * (i%15) * 2);
                let turnDir = 1 - (frameCount%2 == 0)*2;
                track.push({segCount: 3000, segTurn: turnDir * turnDel});
            }
            
        //Setup current position in space
        let curPosition = {x: 0, y: 1, z: 1};
        curPosition.x = -cam.x;
        curPosition.y = -cam.y + 1;
        curPosition.z = -cam.z + 1;

        //Setup the movement vector between the two steps
        let movement = {dX: 0, dY: 0, dZ: 1};

        //Setup the camera angle
        let camAng = cam.z * track[curSection].segTurn;
        //And smooth out the movement vector
        movement.dX = -camAng;
        movement.dY = 0;
        movement.dZ = 1;

        
        //Calculate the Z-axis skew
        let zSkew = skew(cam.x, cam.y, cam.z, movement.dX, movement.dY);
        let camSkewX = zSkew.x;
        let camSkewY = zSkew.y;
        let camSkewZ = zSkew.z;

        //Skew the current position
        curSection.x = -camSkewX;
        curSection.y = -camSkewY + 1;
        curSection.z = -camSkewZ + 1;

        //Draw the track
        for(let i = 0; i < 100; i++){
            //Project coordinates of the current position to the 2D space
            let projection = project(curPosition.x, curPosition.y, curPosition.z);

            //Setup the width of the line and draw it at projected coordinates
            let sectWidth = projection.sc * 2
            line(projection.x - sectWidth, projection.y,
            projection.x + sectWidth, projection.y);

            //Move the current position forward
            curPosition.x += movement.dX;
            curPosition.y += movement.dY;
            curPosition.z += movement.dZ;
            
            //Shape the turn if there is there are any in the current section
            movement.dX += track[curSection].segTurn

            //Move current segments and sections 
            let adv = advance(curSection, curSegment);
            curSection = adv.sect;
            curSegment = adv.segm;
        }
        updateCam(lowMid);
        }  
        else {line (- width/4, height * 0.9, width/4, height * 0.9)
            reset();
        }
        pop();
    }

    //Function to create 2d projection of 3d coordinate
    let project = function(x, y, z){
        let FOV = 100;
        let scale = FOV/z;
        let pX = x * scale;
        let pY = y * scale + FOV * 3;
        
        return {x: pX, y: pY, sc: scale};
    }

    //Function to advance segments/sections
    let advance = function(section, segment){
        let a = section;
        let b = segment;
        //Move to the next segment...
        b += 1;
        //...or to the next section
        if(b > track[a].segCount){
            b = 0;
            a += 1;
            //Loop the track and start from the first section
            if(a > track.length - 1) a = 0;
        }
        return {sect: a, segm: b}
    }

    //Function to update cam position 
    let updateCam = function(speed){
        let sp = map(speed, 0, 255, 0.01, 0.1)
        //Small step
        cam.z += sp;
        if(cam.z > 1)
        cam.z -= 1;
        //Move camera
        let camMov = advance(camSect, camSegm);
        camSect = camMov.sect;
        camSegm = camMov.segm;
    }

    //Function to smoothen horizontal jittering caused by camera skew
    let skew = function(x, y, z, dX, dY){
        return {x: x + z * dX, y: y + z * dY, z: z}
    }

}