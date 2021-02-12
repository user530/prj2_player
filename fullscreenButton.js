function FullscreenButton(){
    let initW = width;
    let initH = height;
    let iconX;
    let iconY;
    let iconW;
    let iconH;

    this.draw = function(){
        //Coordinates of the button
        iconX = width - 20;
        iconY = height - 20;
        iconW = 15;
        iconH = 15;

        //Draw this button
        push();

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
        let visDiv = document.querySelector('#visual');
        
        if(body.style.margin != '0px'){
            body.style.margin = '0px';
            
            visDiv.style.position = 'absolute';
            visDiv.style.left = '0px';
            visDiv.style.top = '0px';

            resizeCanvas(innerWidth, innerHeight);
            
        }
        else {
            body.style.margin = '8px';

            visDiv.style.position = 'static';
            visDiv.style.left = 'auto';
            visDiv.style.top = 'auto';

            resizeCanvas(initW, initH);
        }
        
    }


}