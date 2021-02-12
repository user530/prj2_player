//Idea for this algorithm is inspired by 
//https://www.lexaloffle.com/bbs/?tid=35767
function Vis3(){
    this.name = 'TestVis3';

    frameRate(60);

    // let track = [{segCount: 1000, segTurn: 0},
    // {segCount: 6000, segTurn: -1},
    // {segCount: 800, segTurn: 0},
    // {segCount: 4000, segTurn: 1.5},
    // {segCount: 1000, segTurn: 0.2},
    // {segCount: 400, segTurn: 0},
    // {segCount: 5000, segTurn: -1}];

    //Setup the track
    let track = [
    {segCount: 2400, segTurn: 0},
    {segCount: 1200, segTurn: -0.01},
    {segCount: 1200, segTurn: -0.02},
    {segCount: 1200, segTurn: -0.03},
    {segCount: 1200, segTurn: -0.04},
    {segCount: 1200, segTurn: -0.05},
    {segCount: 1200, segTurn: -0.06},
    {segCount: 1200, segTurn: -0.07},
    {segCount: 1200, segTurn: -0.08},
    {segCount: 1200, segTurn: -0.09},
    {segCount: 1200, segTurn: -0.1},
    {segCount: 1200, segTurn: -0.2},
    {segCount: 1200, segTurn: -0.3},
    {segCount: 1200, segTurn: -0.4},
    {segCount: 1200, segTurn: -0.5},
    {segCount: 1200, segTurn: -0.6},
    {segCount: 1200, segTurn: -0.7},
    {segCount: 1200, segTurn: -0.8},
    {segCount: 1200, segTurn: -0.9},
    {segCount: 1200, segTurn: -1},
    {segCount: 1200, segTurn: -0.9},
    {segCount: 1200, segTurn: -0.8},
    {segCount: 1200, segTurn: -0.7},
    {segCount: 1200, segTurn: -0.6},
    {segCount: 1200, segTurn: -0.5},
    {segCount: 1200, segTurn: -0.4},
    {segCount: 1200, segTurn: -0.3},
    {segCount: 1200, segTurn: -0.2},
    {segCount: 1200, segTurn: -0.1},
    {segCount: 1200, segTurn: -0.09},
    {segCount: 1200, segTurn: -0.08},
    {segCount: 1200, segTurn: -0.07},
    {segCount: 1200, segTurn: -0.06},
    {segCount: 1200, segTurn: -0.05},
    {segCount: 1200, segTurn: -0.04},
    {segCount: 1200, segTurn: -0.03},
    {segCount: 1200, segTurn: -0.02},
    {segCount: 1200, segTurn: -0.01},
    {segCount: 2400, segTurn: 0},
    {segCount: 1200, segTurn: 0.01},
    {segCount: 1200, segTurn: 0.02},
    {segCount: 1200, segTurn: 0.03},
    {segCount: 1200, segTurn: 0.04},
    {segCount: 1200, segTurn: 0.05},
    {segCount: 1200, segTurn: 0.04},
    {segCount: 1200, segTurn: 0.03},
    {segCount: 1200, segTurn: 0.02},
    {segCount: 1200, segTurn: 0.01},
    {segCount: 2400, segTurn: 0}];

    //Setup the camera
    let cam = {x: 0, y: 0, z: 0};
    
    //Setup the camera starting section and segment
    let camSect = 0;
    let camSegm = 0; 
    //Setup current starting section and segment
    let curSection = camSect;
    let curSegment = camSegm;

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
        for(let i = 0; i < 20; i++){
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
        pop();
        updateCam();
    }

    //Function to create 2d projection of 3d coordinate
    let project = function(x, y, z){
        let FOV = width/2;
        let scale = FOV/z;
        let pX = x * scale;
        let pY = y * scale + height/2;
        
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
    let updateCam = function(){
        //Small step
        cam.z += 0.1;
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