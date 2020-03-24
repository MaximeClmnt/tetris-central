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


// Les pièces et leur couleur

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// Générer un pièce aléatoire

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);    // forme et couleur ex : [Z,"red"]
}

let p = randomPiece();

// L'objet pièce

function Piece(forme,color){
    this.forme = forme;
    this.color = color;
    
    this.formeN = 0; // on commence avec la première forme de la pièce.
    this.activeforme = this.forme[this.formeN];		// première forme de la pièce (position de base)
		
    this.x = 3;			// Toutes les formes sont sur des matrices de 4*4, on lance la pièce à la position x = 3 y = -2
    this.y = -2;		
}

// Méthode pour dessiner la pièce.

Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeforme.length; r++){
        for(c = 0; c < this.activeforme.length; c++){
            // on ne dessine que les cases remplies.
            if( this.activeforme[r][c]){		// activeforme[r][c] = 1 ou 0 ; 1 on remplit la case
                drawSquare(this.x + c,this.y + r, color);
            } 
        }
    }
}

// Dessine une pièce sur le canvas

Piece.prototype.draw = function(){
    this.fill(this.color);
}

// Efface une pièce sur le canvas

Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}
