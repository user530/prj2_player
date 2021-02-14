//Idea for this algorithm is inspired by 
//https://www.lexaloffle.com/bbs/?tid=35767
function Vis3(){
    this.name = 'TestVis3';

    let rows = [];

    this.draw = function(){
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");
        let lowMid = fourier.getEnergy("lowMid");
        let mid = fourier.getEnergy("mid");
        let highMid = fourier.getEnergy("highMid");
        let treble = fourier.getEnergy("treble");
        let beatThisFrame = beatdetector.detectBeat(spectrum);

        
        push();
        translate(width/2, height);
        fill(255);
        strokeWeight(0.8);
        stroke(255);

        // if(beatThisFrame)

        //Draw snaps
        for (let i = 0; i < rows.length; i++){
            push();
            stroke(random(0,255), random(0,255), random(0,255))

            if(rows[i].spec == undefined)rows[i].spec = spectrum;

            //Project the center
            let prj = project(rows[i].x, rows[i].y, rows[i].z);
            //Calculate the width
            let w = prj.sc;

            //Calculate points in 3D
            for(let j = 0; j < 300; j++){
                let mapSpec = (1 - 2 * ((rows[i].spec)[j]%2==0))*(rows[i].spec)[j] * 2/255;
                let x = rows[i].x - w/40 + w/(20*300)*j;
                let y1 = rows[i].y;
                let y2 = rows[i].y - mapSpec;

                let prj1 = project(x, y1, rows[i].z);
                let prj2 = project(x, y2, rows[i].z);

                
                line(prj1.x, prj1.y, prj2.x, prj2.y);
            }
            rows[i].z += 0.01;

            if(rows[i].z > 7){
                rows[i].x = 0;
                rows[i].y = 1;
                rows[i].z = 1;
                rows[i].spec = undefined;
            }
            pop();
        }
        if (frameCount%60 == 0 && rows.length < 10) rows.push({x: 0, y: 1, z: 1})
        pop();
    }        

    //Function to create 2d projection of 3d coordinate
    let project = function(x, y, z){
        let FOV = width/7;
        let scale = FOV/z;
        let pX = x * scale;
        let pY = y * scale - FOV * 2 ;
        
        return {x: pX, y: pY, sc: scale};
    }
}