function Timeline(lineID){
    let line = document.querySelector(`#${lineID}`);
    let timetick;
    let listener = null;

    //Add clickable timeline
    line.addEventListener('click', (e)=>{
        //Slider X
        let sl_x = line.getBoundingClientRect();
        //Click X
        let cl_x = e.clientX
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
        //Restore callback
        curSong.onended(()=>{
            newTrack(nextSong(player))});
        //Update the input value
        line.value = stamp;
        //Restart updating timeline
        this.updateTimeline();
    })

    //Function to update the timeline(input #timeline)
    this.newTimeline = function(song){
        //Set new max equal to the duration
        line.max = song.duration();
        //Calculate and set new value of the timeline tick (time / line width)
        timetick = line.max / 700;
        line.step = timetick;
    }

    //Function to pause
    this.stopTimeline = function(){
            //Stop updating
            clearInterval(listener);
        
    }

    //Function to start/pause updating 
    this.updateTimeline = function(){
        //Clear previous updater
        clearInterval(listener);
        //Set up new one
        listener = setInterval(()=>{line.value = curSong.currentTime()}, 
        line.step);
    }

}