// ajouter la gestion avec le serveur ici ! (envoyer les informations de notre canvas + score, et récupérer celle de l'adversaire).

// Descendre la pièce toutes les 1 secondes.

var player = document.querySelector('#audioPlayer');
player.play();
let dropStart = Date.now();
let gameOver = false;

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p1.moveDown();			// envoyer les informations du tableau au serveur ici ! 
        p2.moveDown();			// envoyer les informations du tableau au serveur ici ! 
        dropStart = Date.now();
		//drawBoard_adversaire(); // récupérer les informations du tableau adverse sur le serveur ici ! 
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

console.log('drop');
drop();
