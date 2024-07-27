// Adding Goose
const img = document.createElement('img');
img.src = chrome.runtime.getURL('assets/goos.png');
img.style.position = 'fixed';
img.style.bottom = '10px';
img.style.right = '10px';
img.style.zIndex = '1000';
img.style.width = '50px';
img.style.height = '50px';
img.style.backgroundSize = 'cover';
img.id = 'goose'
document.body.appendChild(img);

function moveGoose(img, x, y) {
    let gooseX = Number(img.style.right.substring(0, img.style.right.length-2));
    let gooseY = Number(img.style.bottom.substring(0, img.style.bottom.length-2));

    let intervalId = setInterval(function() {
        if (Math.abs(gooseX - x) <= 1 && Math.abs(gooseY - y) <= 1) {
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
    }, 10);
}

setInterval(() =>{
    moveGoose(img,Math.floor(Math.random()*(window.innerWidth/10)), Math.floor(Math.random()*(window.innerHeight/10)));
}, 1000)