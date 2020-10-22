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
		this.objectRegister.Field = new Array(field);
		//Call field`s method for create new tiles
		field.craeteTiles(this.amountWariablesColors);
		this.objectRegister.Tile = new Array();
		//Add these tiles into register
		for (let i = 0; i < field._matrixOfTiles.length; i++) {
			for (let k = 0; k < field._matrixOfTiles[i].length; k++) {
				this.objectRegister.Tile.push(field._matrixOfTiles[i][k]);
			}
		}
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
			delete this.objectRegister.Tile[index];
		}
		this._view.draw();
		//Remove blaasted tiles from field`s matrix
		/*let field = this.objectRegister.Field[0];
		for (let i = 0; i < field._matrixOfTiles.length; i++) {
			for (let k = 0; k < field._matrixOfTiles[i].length; k++) {
				let index = this.objectRegister.Tile.indexOf(field._matrixOfTiles[i][k]);
				if(index==-1){
					field._matrixOfTiles[i][k] = null;
				}
			}
		}*/
		//Now, the field moves its tiles down to the vacant ones
		this.objectRegister.Field[0].moveTiles();
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
	}
	linkTiles() {
		//This method adds for each tile links to adjacent tiles
		for (let i = 0; i < this._matrixOfTiles.length; i++){
			for (let k = 0; k < this._matrixOfTiles[i].length; k++){
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
	moveTiles(){
		console.log("Start Field.moveTiles()");
		console.log(this._matrixOfTiles);
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