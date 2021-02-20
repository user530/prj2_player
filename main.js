// Main js file that handles all main components (player, playlist and visualisations)

// Player object that keep all settings and playlist
let player = {playlist: [],
                volume: 1,
                showPL: true,
                showVIS: true,
                repeatSong: false,
                loopPlaylist: false,
                shufflePlay: false,
                cycleEnd: false
            };

// Initialize variable for the current song
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
let bgColor = 0;
let display = document.querySelector('#display');
let btns = document.getElementsByClassName('ctrlBtn');

// Load song
function preload(){
    curSong = loadSound(sampleSound, 
        ()=>{timeline.newTimeline(curSong)}, 
        ()=>{alert('Unsupported file format!')});
        buffering();
}

// Load all components and setup canvas
function setup(){
    
    // Setup default framerate
    frameRate(60);
 
    //Setup canvas
    let visualContainer = document.querySelector('#visual');
    let dimens = visualContainer.getBoundingClientRect();
    let a = createCanvas (dimens.width, dimens.width * 0.8 * 3/4);
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
    vis.add(new Snakeline());
    vis.add(new Fireworks());
    vis.add(new Vis1());
    vis.add(new Vis2());
    vis.add(new Vis3());

}

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
    
    // Custom drag'N'drop field
    // 1)Copy dragged files
    dropZone.addEventListener('dragover', (e) => {

        // Prevent default behaviour and propagation to the child elements 
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy';

    });

    // 2)Load copied songs 
    dropZone.addEventListener('drop', (e) => {

        // Prevent default behaviour and propagation to the child elements
        e.stopPropagation();
        e.preventDefault();

        //Read and load input files
        loadFiles(e.dataTransfer, player.playlist);

        //Show playlist
        showPlaylist(player.playlist, dropZone);

    });
    
    //Button to activate deletion process
    document.querySelector('#btnDelSong').addEventListener('click', (e)=>{

        // Prevent default behaviour
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

            // Add class and change button text
            e.target.classList.add('btnPressed');
            e.target.innerHTML = "Confirm DELETE"

        }else {

            // Select all checkboxes
            let checkArr = document.querySelectorAll('#checkboxBlock input');
            
            //Delete "checked" tracks
            let c = 0;
            for (let i = 0; i < checkArr.length; i++){ 
                if (checkArr[i].checked) {player.playlist.splice(i - c, 1); c++}
            }

            //Update playlist div
            showPlaylist(player.playlist, dropZone);
           
            // Switch "deleted" track
            // Select next selected track or 'sample' if playlist is empty
            if(document.querySelector('.selected') != null){
                if(curSong.file != document.querySelector('.selected').value){
                stopCycle();
                curSong = loadSound(document.querySelector('.selected').value, 
                                    ()=>{timeline.newTimeline(curSong)},
                                    ()=>{alert('Unsupported file format!')});
                buffering();
                }
            }else{
                stopCycle();
                curSong = loadSound(sampleSound, 
                                    ()=>{timeline.newTimeline(curSong)},
                                    ()=>{alert('Unsupported file format!')});
                buffering();
            }

            // Delete class and change button text back
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

        // Prevent default behaviour
        e.stopPropagation();

        // Switch button and change visibility of the playlist
        toggleBtn(e.target, document.querySelector('#playlistWrapper'), 'showPL');
        
    });

    //ShowVisuals Button
    document.querySelector('#btnShowVisuals').addEventListener('click', (e)=>{

        // Prevent default behaviour
        e.stopPropagation();

        // Switch button and change visibility of the visualisator
        toggleBtn(e.target, document.querySelector('#visual'), 'showVIS');
        
    });

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

            //Stop timeline tracker
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

        //Works only if player is not in the buffering state
        if(!bufferingState){

            // Load previous(depending on settings) song
            newTrack(prevSong(player));
        }
    });

    //Next track button
    document.querySelector('#btnNext').addEventListener('click', (e)=>{

        //Works only if player is not in the buffering state
        if(!bufferingState){

            // Load next(depending on settings) song
            newTrack(nextSong(player));
        }
    });

    //Repeat button
    document.querySelector('#btnRepeat').addEventListener('click', (e)=>{

        // Switch loop mode for the song 
        curSong.setLoop(!player.repeatSong);

        // Switch button to give visual clue
        toggleBtn(e.target, undefined, 'repeatSong');

    });

    //Shuffle play
    document.querySelector('#btnShuffle').addEventListener('click', (e)=>{

        // Switch button to give visual clue
        toggleBtn(e.target, undefined, 'shufflePlay');

    });

    //Loop playlist
    document.querySelector('#btnLoop').addEventListener('click', (e)=>{

        // Switch button to give visual clue
        toggleBtn(e.target, undefined, 'loopPlaylist');

    });

    // Change volume on click
    document.querySelector('#rangeVolume').addEventListener('change', (e)=>{

        // Set volume level for the player
        player.volume = e.target.value;

        // Change volume of the song 
        curSong.setVolume(+player.volume);

    })

}

// Initialize draw in the visualisation window
function draw(){
    background(bgColor);

	// Draw the selected visualisation
    vis.selectedVisual.draw();
    
    // Draw the controls on top
    controls.draw();
}

// Initialize mouse controls
function mouseClicked(){
    controls.mousePressed();
}

// Initialize keyboard controls
function keyPressed(){
	controls.keyPressed(keyCode);
}

// Function to allow user input for the songs
function loadFiles(source, playlistArr){
    let fileList = source.files;
    
    // Allow multiple files
    for (let i = 0; i < fileList.length; i++){

        //Add only media files
        if (fileList[i].type.includes('audio')){
            playlistArr.push(fileList[i]);
        }
    }
}

// Function that handles playlist component
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

    //Ability to switch active track by click on the name in the playlist
    for (let i = 0; i < playNode.length; i++){
        playNode[i].addEventListener('click', (e)=>{

            //Select new track on click
            newTrack(e.target);

            //Reset the cycle break
            player.cycleEnd = false;
        })
    }
}

// Function to load new song (previous or next)
function newTrack(trackLine){
    
    //Stop callback loop from ocuring
    curSong.onended(()=>{});

    // Current track
    let selected = document.querySelector('.selected');

    //Clear prev track selection and add new if there are songs in playlist
    if(selected != null){
        selected.classList.remove('selected');
        trackLine.classList.add('selected');
        
        // Load new selected song and start playing
        if (curSong.isPlaying() || curSong.isPaused()){
            stopCycle();
            curSong = loadSound(trackLine.value, 
                                    ()=>{timeline.newTimeline(curSong);
                    playCycle();},
                    ()=>{alert('Unsupported file format!')});

            // Show metadata
            buffering();

        }
        // Load new selected song 
        else curSong = loadSound(trackLine.value, 
                                    ()=>{timeline.newTimeline(curSong)},
                                    ()=>{alert('Unsupported file format!')});

            // Show metadata
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

// Function to play the track (with autoplay) and update its timeline
function playCycle(){

    // If break not reached -> play and shedule next song
    if(!player.cycleEnd){

        // Start playing
        curSong.play();

        //Keep player settings
        loadPlayerSettings(player);

        // Start updating timeline
        timeline.updateTimeline();

        // Update queque
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

            // Reset play cycle if needed
            if(player.cycleEnd) player.cycleEnd = false;

            // Return random is more than one song
            if(player.playlist.length != 1){
                let a = indexRandom(playerObj);
                
                // Random until index is equal to the current
                while (a == curInd){
                    a = indexRandom(playerObj)
                }

                // Return new random song
                return dropZone[a];
            }
            // Return the only song in playlist
            else return dropZone[0];
        }
        else{

            //Return to 1st track when finished
            if(!playerObj.loopPlaylist){
                if(curInd+1 < dropZone.length) return dropZone[curInd+1];
                else{
                    player.cycleEnd = true;
                    return dropZone[curInd];
                };
            }
            // Loop playlist
            else {
                
                // Reset play cycle if needed and select 1st song
                if(player.cycleEnd) player.cycleEnd = false; 
                return dropZone[(curInd+1)%dropZone.length];
            }
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

    // If 'add' argument passed -> add class names
    if(addOrRemove == 'add'){
        for (let i = 0; i < arr.length; i++){
            arr[i].classList.add(clName);
        }
    }
    // If 'remove' argument passed -> remove class names
    else if(addOrRemove == 'remove'){
        for (let i = 0; i < arr.length; i++){
            arr[i].classList.remove(clName);
        }
    }
}

//Function to display meta data on small screen
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
