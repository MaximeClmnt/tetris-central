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

// Déplacer la pièce vers le bas

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeforme)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // On bloque la pièce et on en génère une nouvelle
        this.lock();				
        p = randomPiece();
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

let score = 0;

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
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // enlever les lignes remplies
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // Si la ligne est remplie
            // on descend vers le bas toutes les lignes du dessus
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // La ligne du dessus n'as plus de case, on les redessine
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // on augmente le score du joueur
            score += 10;
        }
    }
    // on met à jour le tableau
    drawBoard();
    
    // on mets à jour le score sur la page
    scoreElement.innerHTML = score;
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
            if( board[newY][newX] != VACANT){
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
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

