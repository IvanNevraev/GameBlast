class Game {
	/*
	 This is a main class of the game. It prepare and create all using content.
	 Constrictor recive a object of the View class. This object will draw all objects.
	 objectRegister contains current active objects.
	 */
	_view;
	objectRegister = {};
	amountWariablesColors = 2;
	amountTilesForBlast = 2;
	amountTilesInWidth = 5;
	amountTilesInHeight = 5;

	constructor(view, objectRegister) {
		this._view = view;
		this.objectRegister = objectRegister;
		this.objectRegister.Field = new Array();
		this.objectRegister.Tile = new Array();
		console.log(this);
	}
	begin() {
		this.createNewField();
		this._view.draw();
	}
	createNewField() {
		//Create new field
		let field = new Field(this.amountTilesInWidth, this.amountTilesInHeight);
		//Add it into  register
		this.objectRegister.Field.push(field);
		//Call field`s method for create new tiles
		//Link these tiles with register
		matrixToLineArray(field.craeteTiles(this.amountWariablesColors), this.objectRegister.Tile);
		//Call field`s method for link tiles each other
		field.linkTiles();
    }
	facade(object){
		//Any requests from the controller come here
		for(let key in object){
			if(key=="clickOnTile"){
				if(object[key].length>=this.amountTilesForBlast){
					this.blastTiles(object[key]);
				}
			}
		}
	}
	blastTiles(arrayTiles){
		//Remove tiles from objectRegister
		console.log("Start Game.blastTiles()");
		for(let i=0; i<arrayTiles.length; i++){
			let index = this.objectRegister.Tile.indexOf(arrayTiles[i]);
			this.objectRegister.Tile[index] = null;
		}
		//Remove tiles from field`s matrix
		this.objectRegister.Field[0].deleteTiles(arrayTiles);
		//Move tailes to vacant places
		this.objectRegister.Field[0].fallTiles();
		//Add tailes for empty cell
		let matrix = this.objectRegister.Field[0].addTiles(this.amountWariablesColors)
		matrixToLineArray(matrix, this.objectRegister.Tile);
		this._view.draw();
	}
}
class Obj {
	width = 0;
	height = 0;
	X = 0;
	Y = 0;
	Z = 0;
	img = null;
	constructor() {

    }
}
class Field extends Obj{ 
	//This class for a field with tiles
	_matrixOfTiles;
	constructor(amountTilesInWidth, amountTilesInHeight) {
		super();
		//Create a matrix with the specified number of tiles
		this._matrixOfTiles = new Array();
		for (let i = 0; i < amountTilesInHeight; i++){
			let arr = new Array();
			for(let k=0; k<amountTilesInWidth; k++){
				arr[k] = null;
			}
			this._matrixOfTiles[i] = arr;
		}
	}
	craeteTiles(amountColors) {
		//This method create tiles for field with specified number of colors
		for (let i = 0; i < this._matrixOfTiles.length; i++){
			for (let k = 0; k < this._matrixOfTiles[i].length; k++){
				let colorNumber = randomInteger(0, amountColors - 1);
				this._matrixOfTiles[i][k] = new Tile(i + " " + k, colorNumber,this,i,k);
			}
		}
		return this._matrixOfTiles;
	}
	linkTiles() {
		//This method adds for each tile links to adjacent tiles
		for (let i = 0; i < this._matrixOfTiles.length; i++){
			for (let k = 0; k < this._matrixOfTiles[i].length; k++){
				if (this._matrixOfTiles[i][k] == null) {
					continue;
                }
				this._matrixOfTiles[i][k].isCounted = false;
				if(k-1>=0){
					this._matrixOfTiles[i][k].leftTile = this._matrixOfTiles[i][k-1];
				}
				if(i-1>=0){
					this._matrixOfTiles[i][k].upTile = this._matrixOfTiles[i-1][k];
				}
				if (k + 1 < this._matrixOfTiles[i].length){
					this._matrixOfTiles[i][k].rightTile = this._matrixOfTiles[i][k+1];
				}
				if (i + 1 < this._matrixOfTiles.length){
					this._matrixOfTiles[i][k].bottomTile = this._matrixOfTiles[i+1][k];
				}
			}
		}
	}
	deleteTiles(tiles) {
		console.log("Start Field.deleteTiles");
		//This method delete tiles from _matrixOfTiles
		for (let i = 0; i < this._matrixOfTiles.length; i++) {
			for (let k = 0; k < this._matrixOfTiles[i].length; k++) {
				if (tiles.indexOf(this._matrixOfTiles[i][k]) != -1) {
					this._matrixOfTiles[i][k] = null;
                }
				
			}
		}
    }
	fallTiles() {
		//This method moves the tile downward until there is an empty space. The loop starts iterating from the bottom.
		console.log("Start Field.moveTiles()");
		let y;
		for (let i = this._matrixOfTiles.length-2; i >=0; i--) {
			for (let k = this._matrixOfTiles[i].length - 1; k >= 0; k--) {
				y = i;
				if (this._matrixOfTiles[y + 1][k] == null && this._matrixOfTiles[y][k]!=null) {
					while (this._matrixOfTiles[y + 1][k] == null) {
						this._matrixOfTiles[y][k].row = y + 1;
						this._matrixOfTiles[y + 1][k] = this._matrixOfTiles[y][k];
						this._matrixOfTiles[y][k] = null;
						if ((y + 1) < this._matrixOfTiles.length-1) {
							y++;
						} else {
							break;
                        }
                    }
                }
			}
		}
		return this._matrixOfTiles;
	}
	addTiles(amountColors = 1) {
		//This method add tiles for empty cell
		console.log("Start Field.addTiles()");
		for (let i = 0; i < this._matrixOfTiles.length; i++) {
			for (let k = 0; k < this._matrixOfTiles[i].length; k++) {
				if (this._matrixOfTiles[i][k] == null) {
					let colorNumber = randomInteger(0, amountColors - 1);
					this._matrixOfTiles[i][k] = new Tile(i + " " + k, colorNumber,this,i,k);
                }
			}
		}
		this.linkTiles();
		return this._matrixOfTiles;
    }
}
class Tile extends Obj{
	_id;
	_color;
	_field;
	row;
	column;
	leftTile = null;
	upTile = null;
	rightTile = null;
	bottomTile = null;
	isCounted = false;
	constructor(id="unkown",color=0,field=null,row=0,column=0) {
		super();
		this._id = id;
		this._color = color;
		this._field = field;
		this.row = row;
		this.column = column;
	}
}