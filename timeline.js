// Function that handles timeline and its interactions
function Timeline(lineID){
    let line = document.querySelector(`#${lineID}`);
    let timetick;
    let listener = null;
    this.curTime = line.value;

    //Add clickable timeline
    line.addEventListener('click', (e)=>{
        if(!bufferingState){

            // Recalculate step in case of resize
            this.newTimeline(curSong);

            //Slider X
            let sl_x = line.getBoundingClientRect();

            //Click X
            let cl_x = e.clientX;

            //Calculate the length of the segment
            let time_width = cl_x - sl_x.x;

            //Calculate the time from the segment length and the tick value
            let stamp = timetick * time_width;

            //Stop updating
            clearInterval(listener);

            //Clear callback before stop and stop the song (for some reason jumping on active play caused some weird bugs)
            curSong.onended(()=>{});
            curSong.stop();

            //Jump to the click timestamp
            curSong.jump(stamp);

            //Load settings, so if a user starts playing using timeline settings load properly 
            loadPlayerSettings(player);

            //Restore callback
            curSong.onended(()=>{
                newTrack(nextSong(player))});

            //Update the input value
            line.value = stamp;

            //Restart updating timeline
            this.updateTimeline();
        }
    })

    //Function to update the timeline(input #timeline)
    this.newTimeline = function(song){

        //Set new max equal to the duration
        line.max = song.duration();

        //Calculate and set new value of the timeline tick (time / line width)
        timetick = line.max / line.clientWidth;
        line.step = timetick;
    }

    //Function to pause (with/or without reset)
    this.stopTimeline = function(reset = true)
    {
        if(reset){
            //Stop updating
            clearInterval(listener);

            //Reset timestamp and display
            line.value = 0;
            
            //Save the 'paused' time and set it to the display
            this.curTime = line.value;
            display.lastElementChild.innerHTML = `Time: ${this.curTime}
                                                    / ${this.split(curSong.duration(), 'number', 2)}`;

        }else{
            //Stop updating
            clearInterval(listener);
        }
    }

    //Function to start/pause updating 
    this.updateTimeline = function(){
        //Clear previous updater
        clearInterval(listener);

        //Set up new one
        listener = setInterval(()=>{

            //Update the timeline pos
            line.value = curSong.currentTime();

            //Update the cur time value for the display
            display.lastElementChild.innerHTML = `Time: ${this.split(curSong.currentTime(), 'number', 2)} / ${this.split(curSong.duration(), 'number', 2)}`;
    }, 
        line.step);
    }

    //Helper function to split the filename
    this.split = function split(filename, nameOrFormat, numOfSymbAfterDot = 0){
        // if we need to get the name of the song
        if(nameOrFormat == 'name'){
            return filename.slice(0, filename.lastIndexOf('.'));
        }
        // if we need to get the format of the song
        else if(nameOrFormat == 'format'){
            return filename.slice(filename.lastIndexOf('.')+1);
        }
        // if we need to truncate number
        else if(nameOrFormat == 'number'){
            return (filename + '').slice(0, (filename + '').lastIndexOf('.') + 1 + numOfSymbAfterDot);
        }
    }
}