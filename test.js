// Main js file that handles player, playlist and visualisation
let player = {playlist: [],
                volume: 1,
                showPL: true,
                showVIS: true,
                repeatSong: false,
                loopPlaylist: false,
                shufflePlay: false,
                cycleEnd: false};
let curSong;

// Sample sound for testing
let sampleSound = 'jump.wav';

// Loading state
let bufferingState = false;

// Initialize timeline component
let timeline = new Timeline('timeline');

// Initialize beat detection
let beatdetector = new BeatDetector();

// Setup other variables that we use
let controls;
let vis;
let fourier;
let dropZone;
let display = document.querySelector('#display');
let btns = document.getElementsByClassName('ctrlBtn');

let bgColor = 0;

// Load song
function preload(){
    curSong = loadSound(sampleSound, 
        ()=>{timeline.newTimeline(curSong)});
        buffering();
}

// Load all components and setup canvas
function setup(){
    
    frameRate(60);

    //Setup canvas
    let visualContainer = document.querySelector('#visual');
    let dimens = visualContainer.getBoundingClientRect();
    let a = createCanvas (dimens.width, dimens.width * 3/4);
    a.parent(visualContainer);

    //Initialize controlas and sound data
    controls = new ControlsAndInput();
    fourier = new p5.FFT();

    //Setup visualisation container
    vis = new Visualisations();

    //Add visualisations to the container
    vis.add(new Spectrum());
    vis.add(new WavePattern());
    vis.add(new Needles());
    vis.add(new RidgePlots());
    vis.add(new Vis1());
    vis.add(new Vis2());
    vis.add(new Vis3());

}

// // Change canvas size on resize
// window.addEventListener('resize', ()=>{
//     let visDiv = document.querySelector('#visual');
//     let wrap = visDiv.getBoundingClientRect();
//     resizeCanvas(wrap.width, wrap.height);
//     // canvas.style.width = '100%';
//     // canvas.style.height = '100%';
// })

// Initialize only when page fully loaded
window.onload = function(){
    
    //Define playlist zone that will be used
    dropZone = document.querySelector('#dropField');
    
    //AddSongBtn
    document.querySelector('#btnAddSong').addEventListener('change', (e)=>{

        //Read and load input files
        loadFiles(e.target, player.playlist);

        //Show playlist
        showPlaylist(player.playlist, dropZone);

        e.target.value = '';
    });
    
    //Custom drag'N'drop field
        //Copy dragged files
    dropZone.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy';
    });
        //Load copied songs 
    dropZone.addEventListener('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();

        //Read and load input files
        loadFiles(e.dataTransfer, player.playlist);

        //Show playlist
        showPlaylist(player.playlist, dropZone);

    });
    
    //DelSongBtn
    document.querySelector('#btnDelSong').addEventListener('click', (e)=>{
        e.stopPropagation();
        
        //First click sets value
        if (!e.target.hasAttribute('value')) e.target.value = false;

        //The first click activate "Edit mode", the second click confirms "Delete"
        let deleteZone = document.querySelector('#checkboxBlock');
        if (e.target.value == "false"){
            //Show checkboxes 
            for(let i = 0; i < player.playlist.length; i++){
                let checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                // dropZone.appendChild(checkBox);
                deleteZone.appendChild(checkBox);
            }
            e.target.classList.add('btnPressed');
            e.target.innerHTML = "Confirm DELETE"
        }else {
            let checkArr = document.querySelectorAll('#checkboxBlock input');
            
            //Delete "checked" tracks
            let c = 0;
            for (let i = 0; i < checkArr.length; i++){ 
                if (checkArr[i].checked) {player.playlist.splice(i - c, 1); c++}
            }

            //Update playlist div
            showPlaylist(player.playlist, dropZone);
           
            // Switch "deleted" track
            // Select next selected track or 'sample' if playlist empty
            if(document.querySelector('.selected') != null){
                if(curSong.file != document.querySelector('.selected').value){
                stopCycle();
                curSong = loadSound(document.querySelector('.selected').value, 
                                    ()=>{timeline.newTimeline(curSong)});
                buffering();
                }
            }else{
                stopCycle();
                curSong = loadSound(sampleSound, 
                                    ()=>{timeline.newTimeline(curSong)});
                buffering();
            }

            e.target.classList.remove('btnPressed');
            e.target.innerHTML = "Delete";
        };

        //Toggle "Edit mode"
        if (e.target.value == 'false'){
            e.target.value = 'true'
        }else e.target.value = 'false'

    });

    //ShowPlaylist Button
    document.querySelector('#btnShowPlaylist').addEventListener('click', (e)=>{
        e.stopPropagation();

        toggleBtn(e.target, document.querySelector('#playlistWrapper'), 'showPL');
        
    });

    //ShowVisuals Button
    document.querySelector('#btnShowVisuals').addEventListener('click', (e)=>{
        e.stopPropagation();

        toggleBtn(e.target, document.querySelector('#visual'), 'showVIS');
        
    });


    //BUTTONS------------------------------------------------------------
    //Play button
    document.querySelector('#btnPlay').addEventListener('click', (e)=>{
        //Works only if player is not in buffering state
        if(!bufferingState){
            //Reset the cycle break(If player auto-stop in the end -> allow to play the last song again)
            player.cycleEnd = false;
            //Launch autoplay
            if (!curSong.isPlaying()){
                playCycle();
            }
        }
    });

    //Pause button
    document.querySelector('#btnPause').addEventListener('click', (e)=>{
        //Works only if player is not in buffering state
        if(!bufferingState){
            //Stop next callback event(next track playback)
            curSong.onended(()=>{});
            //Stop timetracker
            timeline.stopTimeline(false);
            //Pause current track
            curSong.pause();
        }
    });

    //Stop button
    document.querySelector('#btnStop').addEventListener('click', (e)=>{
        //Works only if player is not in buffering state
        if(!bufferingState){
            //Stop next callback event(next track playback)
            curSong.onended(()=>{});
            //Stop current track
            stopCycle();
        }
    });
    
    //Previous track button
    document.querySelector('#btnPrevious').addEventListener('click', (e)=>{
        //Works only if player is not in buffering state
        if(!bufferingState){
            newTrack(prevSong(player));
        }
    });

    //Next track button
    document.querySelector('#btnNext').addEventListener('click', (e)=>{
        //Works only if player is not in buffering state
        if(!bufferingState){
            newTrack(nextSong(player));
        }
    });

    //Repeat button
    document.querySelector('#btnRepeat').addEventListener('click', (e)=>{
        curSong.setLoop(!player.repeatSong);
        toggleBtn(e.target, undefined, 'repeatSong')
    });

    //Shuffle play
    document.querySelector('#btnShuffle').addEventListener('click', (e)=>{
        toggleBtn(e.target, undefined, 'shufflePlay')
    });

    //Loop playlist
    document.querySelector('#btnLoop').addEventListener('click', (e)=>{
        toggleBtn(e.target, undefined, 'loopPlaylist');
    });

    // Change volume on click
    document.querySelector('#rangeVolume').addEventListener('change', (e)=>{
        player.volume = e.target.value;
        curSong.setVolume(+player.volume);
    })

}

function draw(){
    background(bgColor);

	//draw the selected visualisation
    vis.selectedVisual.draw();
    
    //draw the controls on top.
    controls.draw();
}

function mouseClicked(){
    controls.mousePressed();
}

function keyPressed(){
	controls.keyPressed(keyCode);
}

function loadFiles(source, playlistArr){
    let fileList = source.files;
    
    for (let i = 0; i < fileList.length; i++){
        //Add only media files
        if (fileList[i].type == 'audio/mpeg'){
            playlistArr.push(fileList[i])
        }
    }
}

function showPlaylist(playlistArr, playlistDiv){
    //Clear playlist screen
    playlistDiv.innerHTML = '';
    document.querySelector('#checkboxBlock').innerHTML = '';

    //Show tracks and their metadata 
    for (let i = 0; i < playlistArr.length; i++){
        let track = document.createElement('div');
        let trackName = playlistArr[i].name.substring(0, playlistArr[i].name.lastIndexOf('.'));
        let trackFormat = playlistArr[i].name.substring(playlistArr[i].name.lastIndexOf('.')+1, playlistArr[i].name.length);
        track.innerHTML += `${i+1}) ${trackName} ...... ${trackFormat}`;
        track.value = playlistArr[i];
        playlistDiv.appendChild(track);
    }

    //Select new selected track
    let playNode = document.querySelectorAll(`#${playlistDiv.id} div`);
    
    //Select only if playlist is not empty
    if (playNode.length > 0){
        //If currently playing track is in the playlist select it  
        if(playlistArr.indexOf(curSong.file) != -1){
            playNode[playlistArr.indexOf(curSong.file)].classList.add('selected');
        }
        //Else select the first track in playlist and load it
        else{
            //Mark the 1st element
            playNode[0].classList.add('selected');
            //Load the 1st track
            curSong.onended(()=>{});
            stopCycle();
            newTrack(playNode[0]);
        }
    }

    //Ability to switch active track
    for (let i = 0; i < playNode.length; i++){
        playNode[i].addEventListener('click', (e)=>{
            //Select new track on click
            newTrack(e.target);
            //Reset the cycle break
            player.cycleEnd = false;
        })
    }
}

function newTrack(trackLine){
    //Stop callback loop from ocuring
    curSong.onended(()=>{});
    let selected = document.querySelector('.selected');
    //Clear prev track selection and add new
    if(selected != null){
        selected.classList.remove('selected');
        trackLine.classList.add('selected');
        
        //Switch active song
        if (curSong.isPlaying() || curSong.isPaused()){
            stopCycle();
            curSong = loadSound(trackLine.value, 
                                    ()=>{timeline.newTimeline(curSong);
                    playCycle();});
            buffering();
            //Keep player settings
            loadPlayerSettings(player);
        }else curSong = loadSound(trackLine.value, 
                                    ()=>{timeline.newTimeline(curSong)});
                buffering();

    }
}

//Function to load player settings for the current track
function loadPlayerSettings(playerObj){
    //Keep loop
    if (playerObj.repeatSong) curSong.setLoop(playerObj.repeatSong);
    //Keep volume
    let v = +playerObj.volume;
    curSong.setVolume(v); 
}

//Function to play the track (with autoplay) and update its timeline
function playCycle(){
    //If break not reached -> play and shedule next song
    if(!player.cycleEnd){
        //Start playing
        curSong.play();
        //Start updating timeline
        timeline.updateTimeline();
        //Update queque
        curSong.onended(()=>{
            newTrack(nextSong(player))});
    }
}

//Function to stop the track and reset its timeline
function stopCycle(){
    curSong.stop();
    timeline.stopTimeline();
}

//Function to calculate the index of the current track selected in the playlist
function indexCurrent(playerObj){
    let curTrack = document.querySelector('.selected')
    if(curTrack != null) return playerObj.playlist.indexOf(curTrack.value);
}

//Function to calculate the index of the random track in the playlist
function indexRandom(playerObj){
    let playlistLength = playerObj.playlist.length;
    return Math.floor(Math.random()*playlistLength)
}

//Function to select next song file
function nextSong(playerObj){
    let dropZone = document.querySelectorAll('#dropField div');
    let curInd = indexCurrent(playerObj);

    if (playerObj.playlist.length > 0){
        //Random song if shuffleON
        if(playerObj.shufflePlay){
            if(player.playlist.length != 1){
                let a = indexRandom(playerObj);
                
                while (a == curInd){
                    a = indexRandom(playerObj)
                }

                return dropZone[a];
            }else return dropZone[0];
        }
        else{
            //Return to 1st track when finished
            if(!playerObj.loopPlaylist){
                if(curInd+1 < dropZone.length) return dropZone[curInd+1];
                else{
                    player.cycleEnd = true;
                    return dropZone[curInd];
                };
            }else return dropZone[(curInd+1)%dropZone.length];
        }  
    }  
};

//Function to select previous song file
function prevSong(playerObj){
    let dropZone = document.querySelectorAll('#dropField div');
    let curInd = indexCurrent(playerObj)

    if (playerObj.playlist.length > 0){
        //Random song if shuffleON
        if(playerObj.shufflePlay){
            let a = indexRandom(playerObj);
            
            while (a == curInd){
            a = indexRandom(playerObj)
            }

            // return PL[a];
            return dropZone[a];
        }
        else{
            //Return to 1st track when finished
            if(!playerObj.loopPlaylist){
                if(curInd-1 >= 0) return dropZone[curInd-1];
                else return dropZone[0];
            }else if(curInd-1 < 0) return dropZone[dropZone.length - 1];
            else return dropZone[curInd - 1];
        }  
    }  
};

//Function for the mass class change
function massClassChange(nodeArr, addOrRemove = 'add', className){
    let arr = nodeArr;
    let clName = className;
    if(addOrRemove == 'add'){
        for (let i = 0; i < arr.length; i++){
            arr[i].classList.add(clName);
        }
    }
    else if(addOrRemove == 'remove'){
        for (let i = 0; i < arr.length; i++){
            arr[i].classList.remove(clName);
        }
    }
}

//Function to display meta data on display
function buffering(){
    let data1 = display.firstElementChild;
    let data2 = display.lastElementChild;

    //Select the filename depending of the origin
    let songName;
    if(curSong.file != sampleSound){
        songName = curSong.file.name
    }else songName = curSong.file

    //Change loading state and 'disable' buttons
    bufferingState = true;
    massClassChange(btns, 'add', 'btnOff');

    //Display loading
    data1.innerHTML = `LOADING`;
    data2.innerHTML = `...`;

    //Draw timeline for the new song
    timeline.newTimeline(curSong)

    //Custom callback to check loading
    let bufferingCheck = setInterval(()=>{
        // If buffering is complete
        if(curSong.isLoaded()){
            //Display meta data
            data1.innerHTML = `Current Song: ${timeline.split(songName,'name')}</br>
                                            File Format: ${timeline.split(songName,'format')}`;
            data2.innerHTML = `Time: 0 / ${timeline.split(curSong.duration(), 'number', 2)}`;
        
            //Change loading state and 'activate' buttons
            bufferingState = false;
            massClassChange(btns, 'remove', 'btnOff');

            //Self terminate
            clearInterval(bufferingCheck);
        }
        // If still buffering
        else{
            //Show loading process dots
            if(data2.innerHTML.length == 5) data2.innerHTML = '.'
            else data2.innerHTML += '.'
        }
    }, 200);

} 

//Function to switch button and visibility of the element
function toggleBtn(btn, element, stateVar){
    // Get inner text and clear it of state
    let txt = btn.innerHTML.substring(0, btn.innerHTML.indexOf(':'));

    // Check if this function should switch wrapper visibility
    let vis = 0;
    if(element != undefined) vis = 1;

    // Change state, text and class depending on the state and arguments
    if(!player[stateVar]){
        btn.innerHTML = txt + ': ON';
        btn.classList.add('btnPressed');
        if(vis == 1)element.parentElement.style.display = 'flex'
    }else{
        btn.innerHTML = txt + ': OFF';
        btn.classList.remove('btnPressed');
        if(vis == 1)element.parentElement.style.display = 'none'
    }
    // Toggle state
    player[stateVar] = !player[stateVar];
}
