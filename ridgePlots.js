// Create waveform lines that create ridge plot
function RidgePlots(){

    let ridges = [];

    this.name = "Ridge plots";

    this.draw = function(){
        let waveform = fourier.waveform();

        background(0);

        //Setup plot dimensions
        let plotWidth = width * 3/5;
        let plotHeight = height * 3/5;
        let verStep = 0.5;
        let bigScale = 60;
        let smolScale = 8;
        
        //Setup initial position
        let startX = width/5;
        let startY = height/5;

        //Clear old lines after the screen adjustment(fullscreen)
        if(ridges.length > 0 && ridges[ridges.length - 1][0].x != startX){
            for(let i = ridges.length - 1; i >= max(ridges.length - 10, 0); i--){
                ridges.splice(i,1);
            }
        }


        push();
            //Setup the graphics
            stroke(255);
            strokeWeight(3);
            noFill();

            //Draw the box
            rect(startX, startY, plotWidth, plotHeight);

            //Add another line to the ridge Array each 30 frame
            if(frameCount%20 == 0){
                //Setup individual line
                let line = [];
                for (let i = 0; i < waveform.length; i++){
                    if (i % 20 == 0){
                        //Setup coordinates of the dots in each line
                        let x = map (i, 0, 1024, startX, startX + plotWidth);
                        let y;
                        if(i < waveform.length * 0.25 || i > waveform.length * 0.75){
                            y = map (waveform[i], -1, 1, - smolScale, smolScale);
                        }else{
                            y = map (waveform[i], -1, 1, - bigScale, bigScale);
                        }
                        line.push({x: x,
                            y: startY - y});
                    }
                }
                ridges.push(line);
            }
                      
            //Draw all ridges
            for(let i = 0; i < ridges.length; i++){
                beginShape();
                //Draw all points in line
                for(let j = 0; j < ridges[i].length; j++){
                    ridges[i][j].y  += verStep;
                    vertex(ridges[i][j].x, ridges[i][j].y);
                }
                endShape();
                //Delete line that left the box
                if(ridges[i][0].y > startY + plotHeight){
                    ridges.splice(i,1);
                }
            }

        pop();
    }

}