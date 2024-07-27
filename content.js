// // Adding Goose
// document.head.appendChild(styleElement);

// var goose = document.createElement('div');
// var s = goose.style;

// s.position = 'fixed';
// s.top = '100px';
// s.left = '100px';
// s.width = '100px';
// s.height = '100px';
// s.pointerEvents = 'none';
// s.backgroundColor = 'red';

// goose.id = "goose";
// console.log("honk");
// document.body.appendChild(goose);
console.log('HIIII');
const img = document.createElement('img');
img.src = chrome.runtime.getURL('gooseIcon.jpg');
img.style.position = 'fixed';
img.style.bottom = '10px';
img.style.right = '10px';
img.style.zIndex = '1000';
img.style.width = '100px';
img.style.height = 'auto';
img.id = 'goose'


console.log("HIIIIIIIIIIIIII");
// document.head.appendChild(<h1>HIJDFSKLFJK</h1>);
document.body.appendChild(img);
