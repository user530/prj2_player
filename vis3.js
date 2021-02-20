//Idea for the 2.5D calculation for this algorithm is inspired by 
//https://www.lexaloffle.com/bbs/?tid=35767
// Draw and move in pseudo 3D snapshots of the spectrum
function Vis3(){
    this.name = 'New Visual 3';
    
    let rows = [];

    let col = 255;

    // Draw the pseudo 3D snapshots
    this.draw = function(){

        // Get required sound data
        let spectrum = fourier.analyze();
        let bass = fourier.getEnergy("bass");
        
        push();
            //Move the center
            translate(width/2, height);
            
            //Default settings
            strokeWeight(0.5);
            stroke(255);

            //Change color of the row if playing
            if(curSong.isPlaying()){
                col = randCol(bass);  
            }
            
            //Draw snapshots
            for (let i = 0; i < rows.length; i++){
                
                //Make each snap individual
                push();

                    //Add or change default color 
                    if(rows[i].col == undefined || rows[i].col == 255) rows[i].col = col;
                    
                    //Change color of the snapshot lines
                    stroke(rows[i].col);

                    //Pass spectrum snapshot to the empty row 
                    if(rows[i].spec == undefined)rows[i].spec = spectrum;

                    //Project the center from 3D to 2D
                    let prj = project(rows[i].x, rows[i].y, rows[i].z);

                    //Calculate the width
                    let w = prj.sc;

                    //Calculate points in 3D
                    buildSnapshot(i, w, 600);

                    //Setup movement cycle
                    movementCycle(i, 7);

                pop();
            }

            //Add rows each second until there are enough
            if (frameCount%60 == 0 && rows.length < 10) rows.push({x: 0, y: 3, z: 1})
        
        pop();
    }        

    //Function to generate bright random color 
    let randCol = function(energy){
        return col = [map(Math.random()*energy, 0, 255, 150, 255),
            map(Math.random()*energy, 0, 255, 150, 255),
            map(Math.random()*energy, 0, 255, 150, 255)]
    }

    //Function to create a 2D projection from 3D coordinates
    let project = function(x, y, z){
        let FOV = width/7;
        let scale = FOV/z;
        let pX = x * scale;
        let pY = y * scale - FOV * 3 ;
        
        return {x: pX, y: pY, sc: scale};
    }

    //Function to draw spectrum lines
    let buildSnapshot = function(snapInd, horWid, lineNumber){

        //Out of bounds check
        if(lineNumber >= 1024)console.log('Argument should be between 0 and 1024');
        else{
            for(let j = 0; j < lineNumber; j++){

            /*Map spectrum (odd energy val - to the bottom, even - to the top),
             height of each line is pseudo-random, max height is "4" */
            let lineHeight = noise(snapInd * j) * 4;
            let mapSpec = (1 - 2 * ((rows[snapInd].spec)[j]%2==0))*(rows[snapInd].spec)[j] * lineHeight/255;
            
            //Calculate coordinates (x is the same for vertical lines)
            let x = rows[snapInd].x - horWid/40 + horWid/(20*lineNumber)*j;
            let y1 = rows[snapInd].y;
            let y2 = rows[snapInd].y - mapSpec;

            //Project this lines from 3D to 2D
            let prj1 = project(x, y1, rows[snapInd].z);
            let prj2 = project(x, y2, rows[snapInd].z);

            //Draw this lines
            line(prj1.x, prj1.y, prj2.x, prj2.y);
            }
        }
    }

    // Function to create movement cycle
    let movementCycle = function(snapInd, dist){

        //Move each snapshot 
        rows[snapInd].z += 0.01;

        //And reset after set distance
        if(rows[snapInd].z > dist){
            rows[snapInd].x = 0;
            rows[snapInd].y = 3;
            rows[snapInd].z = 1;
            rows[snapInd].spec = undefined;
            rows[snapInd].col = undefined;
        }
    }
}