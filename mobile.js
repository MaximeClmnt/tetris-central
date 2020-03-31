let cont=document.getElementById('container');
let socket = io();

joueur=0;
function setjoueur(n){
	joueur=n;
	cont.innerHTML="<div class='rotate-buttons-container'><div class='rotate-buttons-item'><button class='rotate-button' id='rotate' onclick='rotate()'>R</button></div></div></div><div class='translate-buttons-container'><div class='translate-buttons-item'><button class='translate-button' id='translate-left' onclick='moveLeft()'><=</button></div><div class='translate-buttons-item'><button class='translate-button' id='translate-right' onclick='moveRight()'>=></button></div></div><div class='fall-button-container'><div class='fall-button-item'><button class='fall-button' id='fall' onclick='moveDown()'>\/</button></div></div>"
}

function moveLeft(){
	socket.emit('move_command','{"player":'+joueur+',"dir":"left"}');
	console.log('{"player":'+joueur+',"dir":"left"}');
}
function moveRight(){
	socket.emit('move_command','{"player":'+joueur+',"dir":"right"}');
	console.log('{"player":'+joueur+',"dir":"right"}');
}
function moveDown(){
	socket.emit('move_command','{"player":'+joueur+',"dir":"down"}');
	console.log('{"player":'+joueur+',"dir":"down"}');
}
function rotate(){
	socket.emit('move_command','{"player":'+joueur+',"dir":"rotate"}');
	console.log('{"player":'+joueur+',"dir":"rotate"}');
}
