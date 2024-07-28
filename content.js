// Adding Goose
const blacklist = ['www.instagram.com','discord.com','m.youtube.com','x.com','m.facebook.com','www.twitch.tv', 'www.reddit.com'];

const importfr = (path) => {
    return chrome.runtime.getURL('assets/' + path)
}

const Honk = new Audio(importfr('honk.mp3'));
const goosL = chrome.runtime.getURL('assets/goosL.png');
const goosR = chrome.runtime.getURL('assets/goosR.png');
const GoosWalkingL = chrome.runtime.getURL('assets/GoosWalkingL.gif');
const GoosWalkingR = chrome.runtime.getURL('assets/GoosWalkingR.gif');
const lieDownL = importfr('/lieDownL.gif');
const lieDownR = importfr('/lieDownR.gif');
const wakeUpL = importfr('/wakeUpL.gif');
const wakeUpR = importfr('/wakeUpR.gif');
const sleepL = importfr('/sleepL.gif');
const sleepR = importfr('/sleepR.gif');
var asleep = false;
var endPic = goosL;
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

if (document.getElementById('goose')) {
  console.log("Element with ID 'goose' found.");
} else {
  console.log("Element with ID 'goose' not found.");
  document.body.appendChild(img);
}

function honk() {
    Honk.play();
    console.log('honk');

    img.src = endPic;
}

function moveGoose(img, x, y) {
    let gooseX = Number(img.style.right.substring(0, img.style.right.length-2));
    let gooseY = Number(img.style.bottom.substring(0, img.style.bottom.length-2));

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
                // console.log("moving");
            } else if (gooseX < x) {
                gooseX++;
                // console.log("moving");
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

function resetGoose(img){
  img.style.right = '10px';
  img.style.bottom =  '10px';
  console.log("RESET");
}
resetGoose(img)

function sleep(){
    console.log(endPic.substring(endPic.length-1));
    asleep = true;

    if(endPic == goosL){
        img.src = lieDownL;
        console.log('zz');
        setTimeout(() =>{
            img.src = sleepL;
        },500);
        setTimeout(() =>{
            console.log('wake up');
            img.src = wakeUpL;
        },540000);
    }else{
        img.src = lieDownR;
        console.log('zz');
        setTimeout(() =>{
            img.src = sleepR;
        },500);
        setTimeout(() =>{
            console.log('wake up');
            img.src = wakeUpR;
        },540000);
    }
    setTimeout(() =>{
        img.src = endPic;
    },541000);
}

setInterval(() => {
  // resetGoose(img)
  if (document.hasFocus() && !asleep) {
    console.log("moved");
    moveGoose(img,Math.floor(Math.random()*(window.innerWidth/7)), Math.floor(Math.random()*(window.innerHeight/7)));
  }
}, 5000)

setInterval(() => {
    chrome.storage.local.get(["currentWebsite", "startTime"], (data) => {
        const { currentWebsite, startTime } = data;
        console.log(new URL(currentWebsite).hostname);
        if(blacklist.includes(new URL(currentWebsite).hostname)){
            if(new Date().getTime() - startTime > 600000) {
                honk();
                startTime = startTime - 2000;
                chrome.storage.local.set({ startTime: startTime });
            }else if(new Date().getTime() - startTime < 101){
                sleep();
            }
        }
    })
}, 100)
