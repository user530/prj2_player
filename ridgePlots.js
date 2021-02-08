//function to draw ridge plots
function RidgePlots(){

    let ridges = [];

    //vis name
    this.name = "Ridge plots";

    this.draw = function(){
        background(0);
        
        let startX = width/5;
        let startY = height/5;
        let plotWidth = width * 3/5;
        let plotHeight = height * 3/5;
        let verStep = 1;
        let bigScale = 80;
        let smolScale = 5;
        let waveform = fourier.waveform();


        push();
            stroke(255,0,0);
            strokeWeight(3);
            noFill();
            rect(startX, startY, plotWidth, plotHeight);


            //Add another line to Array
                if(frameCount%25 == 0){
                    let line = [];
                    for (let i = 0; i < waveform.length; i++){
                        if (i % 20 == 0){
                            let x = map (i, 0, 1024, startX, startX + plotWidth);
                            if(i < waveform.length * 0.25 || i > waveform.length * 0.75){
                                let y = map (waveform[i], -1, 1, - smolScale, smolScale);
                                line.push({x: x,
                                            y: startY - y});
                            }else{
                                let y = map (waveform[i], -1, 1, - bigScale, bigScale);
                                line.push({x: x,
                                            y: startY - y});
                            }
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