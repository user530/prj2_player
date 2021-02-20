// Fullscreen button that resize visualization window
function FullscreenButton(){
    let initW = width;
    let initH = height;
    let iconX;
    let iconY;
    let iconW;
    let iconH;
    let fsState = false;
    let visDiv = document.querySelector('#visual');
    let wrap = document.querySelector('.visualWrapper');

    this.draw = function(){
        //Coordinates of the button
        iconX = 20;
        iconY = 20;
        iconW = 20;
        iconH = 20;

        //Draw this button
        push();

        //Setup drawing options and draw icon
        stroke(255);
        strokeWeight(3);
        noFill();
        rect(iconX - iconW/2, iconY - iconH/2, iconW, iconH);

        pop();
    }

    //Check if button is clicked
    this.hitCheck = function(){
        if(mouseX >= iconX - iconW/2 && mouseX <= iconX + iconW/2 &&
            mouseY >= iconY - iconH/2 && mouseY <= iconY + iconH/2){
                return true;
            }
        else return false;
    }

    //Resize and move visual window
    this.resize = function(){     
        let body = document.body;
        
        //If not fullscreen -> stretch
        if(body.style.margin != '0px'){

            // Move it to the (0.0)
            body.style.margin = '0px';
            visDiv.style.position = 'absolute';
            visDiv.style.left = '0px';
            visDiv.style.top = '0px';
            
            // Remember dimensions prior to the stretch
            initW = pxToNum(canvas.style.width);
            initH = pxToNum(canvas.style.height);

            // Resize canvas to the full browser window
            resizeCanvas(innerWidth, innerHeight);

            // Toggle on fullscreen state (to prevent resize from listener)
            fsState = true;
        }
        // If fullcreen -> return to small window
        else {

            // Return normal windowed position
            body.style.margin = '8px';
            visDiv.style.position = 'static';
            visDiv.style.left = 'auto';
            visDiv.style.top = 'auto';

            // Resize canvas to the previous windowed size
            resizeCanvas(initW, initH);
            
            // Toggle off fullscreen state
            fsState = false;
        }
        
    }

    // Change canvas size on resize
    window.addEventListener('resize', ()=>{

        // Get padding value
        let pad = window.getComputedStyle(wrap).padding

        // Resize based on container width and paddings in initial 4:3 ratio
        initW = wrap.getBoundingClientRect().width - 40;
        initH = initW * 3/4;
        
        // Resize, based on the size
        if(!fsState)resizeCanvas(initW, initH);
        else resizeCanvas(innerWidth, innerHeight);
    })

    // Helper function to change style str to number value
    let pxToNum = function(str){
        let a = str;
        let n = +a.substring(0, a.indexOf('p'))
        return n;
    }
} 