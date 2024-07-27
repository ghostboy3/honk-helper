// Adding Goose
document.head.appendChild(styleElement);

var goose = document.createElement('div');
var s = goose.style;

s.position = 'fixed';
s.top = '100px';
s.left = '100px';
s.width = '100px';
s.height = '100px';
s.pointerEvents = 'none';
s.backgroundColor = 'red';

goose.id = "goose";
console.log("honk");
document.body.appendChild(goose);
