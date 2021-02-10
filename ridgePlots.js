//function to draw ridge plots
function RidgePlots(){

    let ridges = [];

    //vis name
    this.name = "Ridge plots";

    this.draw = function(){
        background(0);
        let plotWidth = width * 3/5;
        let plotHeight = height * 3/5;
        let verStep = 1;
        let bigScale = 100;
        let smolScale = 10;
        let waveform = fourier.waveform();
        let startX = width/5;
        let startY = height/5;
        //
        if(ridges.length > 0 && ridges[ridges.length - 1][0].x != startX){
            for(let i = ridges.length - 1; i >= max(ridges.length - 10, 0); i--){
                ridges.splice(i,1);
            }
        }
        


        push();
            stroke(255,0,0);
            strokeWeight(3);
            noFill();
            rect(startX, startY, plotWidth, plotHeight);

            //Add another line to Array
                if(frameCount%30 == 0){
                    let line = [];
                    for (let i = 0; i < waveform.length; i++){
                        if (i % 20 == 0){
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
                      

            for(let i = 0; i < ridges.length; i++){
                beginShape();
                for(let j = 0; j < ridges[i].length; j++){
                    ridges[i][j].y  += verStep;
                    vertex(ridges[i][j].x, ridges[i][j].y);
                }
                endShape();
                if(ridges[i][0].y > startY + plotHeight){
                    ridges.splice(i,1);
                }
            }

        pop();
    }

}