const cvs = document.getElementById("tetris");		// le canvas du jeu
const ctx = cvs.getContext("2d");	
const scoreElement = document.getElementById("score");	// affichage du score du joueur

const ROW = 20; // Nombre de carré en hauteur
const COL = 10; // Nombre de carré en largeur
const SQ = 20; // taille d'une case(= carré). 
const VACANT = "WHITE"; // couleur d'un carré vide.

// Désinne un carré
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);			// desinne un carré de couleur color
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);		// desinne les contours du carré en noire pour les séparér.
}

// créer les cases du jeu

let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// désinne les casse du jeu.
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();
