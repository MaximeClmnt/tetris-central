const cvs_j1 = document.getElementById("canvas_j1");		// le canvas du jeu
const ctx_j1 = cvs_j1.getContext("2d");	
const scoreElement_j1 = document.getElementById("score_j1");	// affichage du score du joueur

const cvs_j2 = document.getElementById("canvas_j2");		// le canvas du jeu
const ctx_j2 = cvs_j2.getContext("2d");	
const scoreElement_j2 = document.getElementById("score_j2");	// affichage du score du joueur

const ROW = 20; // Nombre de carré en hauteur
const COL = 10; // Nombre de carré en largeur
const SQ = 20; // taille d'une case(= carré). 
const VACANT = "WHITE"; // couleur d'un carré vide.


var seed1 = Math.floor(Math.random()*10000);
var seed2 = seed1;
function random1() {
    var x = Math.sin(seed1++) * 10000;
    return x - Math.floor(x);
}
function random2() {
    var x = Math.sin(seed2++) * 10000;
    return x - Math.floor(x);
}

// Désinne un carré
function drawSquare(x,y,color,ctx){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);			// desinne un carré de couleur color
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);		// desinne les contours du carré en noire pour les séparér.
}

// créer les cases du jeu

let board_1 = [];
let board_2 = [];
for( r = 0; r <ROW; r++){
    board_1[r] = [];
    board_2[r] = [];
    for(c = 0; c < COL; c++){
        board_1[r][c] = VACANT;
        board_2[r][c] = VACANT;
    }
}

// désinne les casse du jeu.
function drawBoard(joueur){
	if(joueur==1){
		for( r = 0; r <ROW; r++){
			for(c = 0; c < COL; c++){
				drawSquare(c,r,board_1[r][c],ctx_j1);
			}
		}
	}
	else{
		for( r = 0; r <ROW; r++){
			for(c = 0; c < COL; c++){
				drawSquare(c,r,board_2[r][c],ctx_j2);
			}
		}
	}
}
function drawBoards(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board_1[r][c],ctx_j1);
            drawSquare(c,r,board_2[r][c],ctx_j2);
        }
    }
}
drawBoards();

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

function randomPiece(joueur){
	if(joueur==1){
		rand=random1();
	}
	else{
		rand=random2();
	}
    let r = randomN = Math.floor(rand * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1],joueur);    // forme et couleur ex : [Z,"red"]
}

let p1 = randomPiece(1);
let p2 = randomPiece(2);

// L'objet pièce

function Piece(forme,color,joueur){
	this.joueur=joueur;
	
	if(this.joueur==1){
		this.ctx=ctx_j1;
		this.board=board_1;
	}
	else{
		this.ctx=ctx_j2;
		this.board=board_2;
	}
	
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
                drawSquare(this.x + c,this.y + r, color,this.ctx);
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

// Déplacer la pièce vers le bas

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeforme)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // On bloque la pièce et on en génère une nouvelle
        this.lock();		
		
		if(this.joueur==1){
			p1=randomPiece(this.joueur); //Probleme possible ici
		}
		else{
			p2=randomPiece(this.joueur); //Probleme possible ici
		}
    }
    
}

// Déplacer la pièce vers la droite
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeforme)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// Déplacer la pièce vers la gauche
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeforme)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// Pivoter la pièce de 90°
Piece.prototype.rotate = function(){
    let nextPattern = this.forme[(this.formeN + 1)%this.forme.length]; // On choisit la rotation de +1 dans le tableau des formes.
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){		// Collision avec la prochaine rotation de la pièce sur un mur ? (forme en I, J, L, Z, rotation non centré).
        if(this.x > COL/2){
            // mur de droite
            kick = -1; // on décale la pièce d'une case sur la gauche
        }else{
            // mur de gauche
            kick = 1; // on décale la pièce vers la gauche
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){		// s'il n'y a plus de collision on dessine la pièce.
        this.unDraw();
        this.x += kick;
        this.formeN = (this.formeN + 1)%this.forme.length; // (0+1)%4 => 1
        this.activeforme = this.forme[this.formeN];
        this.draw();
    }
}

let score_j1 = 0;
let score_j2 = 0;

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeforme.length; r++){
        for(c = 0; c < this.activeforme.length; c++){
            // we skip the vacant squares
            if( !this.activeforme[r][c]){
                continue;
            }
            // Si la pièce est bloqué en haut du canvas : game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // on bloque la pièce
            this.board[this.y+r][this.x+c] = this.color;
        }
    }
    // enlever les lignes remplies
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (this.board[r][c] != VACANT);
        }
        if(isRowFull){
            // Si la ligne est remplie
            // on descend vers le bas toutes les lignes du dessus
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    this.board[y][c] = this.board[y-1][c];
                }
            }
            // La ligne du dessus n'as plus de case, on les redessine
            for( c = 0; c < COL; c++){
                this.board[0][c] = VACANT;
            }
            // on augmente le score du joueur
			if(this.joueur==1){
				score_j1 += 10;
			}
			else{
				score_j2 += 10;
			}
        }
    }
    // on met à jour le tableau
    drawBoard(this.joueur);
    
    // on mets à jour le score sur la page
    scoreElement_j1.innerHTML = score_j1;
    scoreElement_j2.innerHTML = score_j2;
}

// Fonction de collision

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // si la case est vide on passe
            if(!piece[r][c]){
                continue;
            }
			
            // coordonnées de la pièce après le mouvement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // condition
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;		// il y a une colision
            }
            // case au dessus du jeu,n pas de problème on vérifie sur les case d'après.
            if(newY < 0){
                continue;
            }
            // On vérifie s'il y a pas une pièce déjà bloqué à cette endroit là
            if( this.board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// Contrôle de la pièce

document.addEventListener("keydown",CONTROL);			// à chaque touche appuyé sur le clavier (keydown) appelle la fonction CONTROL

// Fonction  de controle
function CONTROL(event){			
    if(event.keyCode == 37){
        p2.moveLeft();
    }else if(event.keyCode == 38){
        p2.rotate();
    }else if(event.keyCode == 39){
        p2.moveRight();
    }else if(event.keyCode == 40){
        p2.moveDown();
    }else if(event.keyCode == 81){
        p1.moveLeft();
    }else if(event.keyCode == 90){
        p1.rotate();
    }else if(event.keyCode == 68){
        p1.moveRight();
    }else if(event.keyCode == 83){
        p1.moveDown();
    }
}

