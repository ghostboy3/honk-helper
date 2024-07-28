// Adding Goose

const importfr = (path) => {
    return chrome.runtime.getURL('assets/' + path)
}
const goosL = chrome.runtime.getURL('assets/goosL.png');
const goosR = chrome.runtime.getURL('assets/goosR.png');
const GoosWalkingL = chrome.runtime.getURL('assets/GoosWalkingL.gif');
const GoosWalkingR = chrome.runtime.getURL('assets/GoosWalkingR.gif');
const img = document.createElement('img');
img.src = goosL;
img.style.position = 'fixed';
img.style.bottom = '10px';
img.style.right = '10px';
img.style.zIndex = '1000';
img.style.width = '50px';
img.style.height = '50px';
img.style.backgroundSize = 'cover';
img.style.display = 'block';
img.style.alt = 'Loading...';
img.id = 'goose'
document.body.appendChild(img);

function moveGoose(img, x, y) {
    let gooseX = Number(img.style.right.substring(0, img.style.right.length-2));
    let gooseY = Number(img.style.bottom.substring(0, img.style.bottom.length-2));

    var endPic;

    if (gooseX > x) {
        endPic = goosR;
        img.src = GoosWalkingR;
    } else if (gooseX < x) {
        endPic = goosL;
        img.src = GoosWalkingL;
    }

    let intervalId = setInterval(function() {
        if (Math.abs(gooseX - x) <= 1 && Math.abs(gooseY - y) <= 1) {
            img.src = endPic;
            clearInterval(intervalId);
        } else {
            if (gooseX > x) {
                gooseX--;
            } else if (gooseX < x) {
                gooseX++;
            }

            if (gooseY > y) {
                gooseY--;
            } else if (gooseY < y) {
                gooseY++;
            }

            img.style.right = gooseX + 'px';
            img.style.bottom = gooseY + 'px';
        }
    }, 25);
}
setInterval(() =>{
    moveGoose(img,Math.floor(Math.random()*(window.innerWidth/7)), Math.floor(Math.random()*(window.innerHeight/7)));
}, 5000)
