const cvs_adversaire = document.getElementById("adversaire");		// le canvas du jeu
const ctx_adversaire = cvs_adversaire.getContext("2d");	
const scoreElement_adversaire = document.getElementById("score_adversaire");	// affichage du score du joueur


// Désinne un carré
function drawSquare_adversaire(x,y,color){
    ctx_adversaire.fillStyle = color;
    ctx_adversaire.fillRect(x*SQ,y*SQ,SQ,SQ);			// desinne un carré de couleur color
    ctx_adversaire.strokeStyle = "BLACK";
    ctx_adversaire.strokeRect(x*SQ,y*SQ,SQ,SQ);		// desinne les contours du carré en noire pour les séparér.
}

// créer les cases du jeu

let board_adversaire = [];
for( r = 0; r <ROW; r++){
    board_adversaire[r] = [];
    for(c = 0; c < COL; c++){
        board_adversaire[r][c] = VACANT;
    }
}

// désinne les casse du jeu.
function drawBoard_adversaire(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare_adversaire(c,r,board_adversaire[r][c]);
        }
    }
}