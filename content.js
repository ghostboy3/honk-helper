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
chrome.storage.sync.get(["toggleState"], function (result) {
  const value1 = result.toggleState;
  // Do something with the retrieved values
  console.log("toggel state:", value1);
  if (value1) {
    goose = document.getElementById("goose");
    button.style.display = "block";
  } else {
    goose = document.getElementById("goose");
    goose.style.display = "none";
  }
});

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

var l1,l2,l3;

function sleep(){
    console.log(endPic.substring(endPic.length-1));
    asleep = true;

    if(endPic == goosL){
        img.src = lieDownL;
        console.log('zz');
        l1 = setTimeout(() =>{
            img.src = sleepL;
        },500);
        l2 = setTimeout(() =>{
            console.log('wake up');
            img.src = wakeUpL;
        },300000);
    }else{
        img.src = lieDownR;
        console.log('zz');
        l1 = setTimeout(() =>{
            img.src = sleepR;
        },500);
        l2 =setTimeout(() =>{
            console.log('wake up');
            img.src = wakeUpR;
        },300000);
    }
    l3 = setTimeout(() =>{
        img.src = endPic;
    },301000);
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
            if(new Date().getTime() - startTime > 300000) {
                Honk.play();
                startTime = startTime - 2000;
                chrome.storage.local.set({ startTime: startTime });
            }else if(new Date().getTime() - startTime < 101){
                sleep();
            }
        }else{
            try {
                clearTimeout(l1);
                clearTimeout(l2);
                clearTimeout(l3);
            } catch (error) {
                
            }
        }
    })
}, 100)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message from background:", message);
  //
  if (!message) {
    location.reload();
    goose = document.getElementById("goose");
    goose.style.display = "none";
  }
  if (message) {
    location.reload();
    bgoose = document.getElementById("goose");
    button.style.display = "block";
  }
});

const motivationalMessages = [
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "The only way to do great work is to love what you do.",
    "Success is the sum of small efforts, repeated day-in and day-out.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Don’t wait for opportunity. Create it.",
    "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Dream big and dare to fail.",
    "Success is not in what you have, but who you are.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, so don't waste it living someone else's life."
  ];
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };
  
  
    // Select the image element by its ID
    const image = document.getElementById('goose');
  
    // Add an event listener for the click event
    image.addEventListener('click', function() {
        // Code to execute when the image is clicked
        alert(getRandomMessage());
    });