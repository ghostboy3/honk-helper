
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
