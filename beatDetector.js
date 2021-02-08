//Idea for this algorithm is inspired by 
//http://archive.gamedev.net/archive/reference/programming/features/beatdetection/

function BeatDetector(){
    let sampleBuffer = [];

    this.detectBeat = function(spectrum){
        //Simple Beat Detection
        let sum = 0;
        let beatOn = false;

        for (let i = 0; i < spectrum.length; i++){
            sum += spectrum[i] * spectrum[i];
        }

        if (sampleBuffer.length == 60){
            //Detecting a beat
            let sampleSum = 0;

            for(let i = 0; i < sampleBuffer.length; i++){
                sampleSum += sampleBuffer[i]
            }

            let sampleAvg = sampleSum/sampleBuffer.length;

            //Calculate the margin
            let varianceSum = 0;
            for (let i = 0; i < sampleBuffer; i++){
                varianceSum += sampleBuffer[i] - sampleAvg;
            }

            let varianceAvg = varianceSum/sampleBuffer.length;

            let a = -0.15/(25-200)
            let b = 1 + (a * 200);
            let margin = varianceAvg * a + b; 

            //Check the beat
            if(sum > sampleAvg * margin){
                beatOn = true;
            }
            
            //Shift the sample
            sampleBuffer.splice(0,1);
            sampleBuffer.push(sum);

        } else sampleBuffer.push(sum);
        
        return beatOn;
    }
}