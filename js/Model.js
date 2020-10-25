class Game {
	/*
	 This is a main class of the game. It prepare and create all using content.
	 Constrictor recive a object of the View class. This object will draw all objects.
	 objectRegister contains current active objects.
	 */
	_view;
	objectRegister = {};
	amountWariablesColors = 3;
	amountTilesForBlast = 2;
	amountTilesInWidth = 5;
	amountTilesInHeight = 5;
	amountMixing = 2;
	level = 0;    
	points = 0;
	goal = 0;    //level*1000
	progress = 0; //Precent of goal level 0-100
	moves = 0;     //Remaining moves 50-(level*2)

	constructor(view, objectRegister) {
		this._view = view;
		this.objectRegister = objectRegister;
		this.objectRegister.Field = new Array();
		this.objectRegister.Tile = new Array();
		this.objectRegister.Button = new Array();
		this.objectRegister.isControled = false;
		this.objectRegister.ParametersOfGame = {
			"widthInTiles" : 0,
			"heightInTiles" : 0,
			"progress" : 0,
			"points" : 0,
			"moves" : 0,
			"level" : 0
		};
		console.log(this);
	}
	buildeGame() {
		this.buildeLevel(5);
		this.createButtons();
    }
	buildeLevel(level) {
		console.log("Start Model.buildeLevel()");
		this.level = level;
		this.goal = level * 1000;
		this.moves = 50 - (level * 2);
		this.amountTilesForBlast = level + 1 + 5;
		this.points = 0;
		this.progress = 0;
		//Amount colors level/2 but from 2 to 5
		let amountColors = Math.round(level / 2);
		this.amountWariablesColors = amountColors < 2 ? 2 : (amountColors > 5 ? 5 : amountColors);
		let addres = this.objectRegister.ParametersOfGame
		addres.widthInTiles = this.amountTilesInWidth = 4 + level;
		addres.heightInTiles = this.amountTilesInHeight = 4 + level;
		addres.level = level;
		addres.moves = this.moves;
		addres.points = 0;
		addres.progress = 0;
		this.createNewField();
		if (this.checkPossibleBlast(this.objectRegister.Field[0], this.amountTilesForBlast)) {
			console.log("ALL OK START LEVEl");
			this._view.facade({
				"drawLevel": []
			});
		} else {
			console.log("NO AVAILABLE FOR BLAST");
			this.buildeLevel(level);
		}
	}
	buildePause() {
		console.log("Start Model.buildePause()");
	}
	buildeLobby() {
		console.log("Start Model.buildeLobby()");
    }
	createNewField() {
		//Create new field
		let field = new Field(this.amountTilesInWidth, this.amountTilesInHeight);
		//Add it into  register
		this.objectRegister.Field[0] = field;
		//Call field`s method for create new tiles
		//Link these tiles with register
		matrixToLineArray(field.craeteTiles(this.amountWariablesColors), this.objectRegister.Tile);
		//Call field`s method for link tiles each other
		field.linkTiles();
    }
	facade(object){
		//Any requests from the controller come here
		//{"What will we do" : arrayOfChangetObjects}
		for(let key in object){
			if (key == "clickOnTile") {
				let arrayTiles = this.getArrayTilesWithSameColor(object[key]);
				if (arrayTiles.length >= this.amountTilesForBlast) {
					this.blastTiles(arrayTiles);
					this.countParametersOfLevel(arrayTiles);
				}
			} else if (key == "clickOnPauseButton") {
				this.buildePause();
			} else if (key == "clickOnMenuButton") {
				this.buildeLobby();
			} else if (key == "ckickOnRepeatButton") {
				this.buildeLevel(this.level);
			} else if (key == "clickOnNextButton") {
				this.buildeLevel(++this.level);
            }
		}
	}
	blastTiles(arrayTiles) {
		//Remove tiles from objectRegister
		console.log("Start Game.blastTiles()");
		for(let i=0; i<arrayTiles.length; i++){
			let index = this.objectRegister.Tile.indexOf(arrayTiles[i]);
			this.objectRegister.Tile[index] = null;
		}
		//Remove tiles from field`s matrix
		this.objectRegister.Field[0].deleteTiles(arrayTiles);
		this._view.facade({
			"blastTiles" : arrayTiles
		});
		//Move tailes to vacant places
		let matrix = this.objectRegister.Field[0].fallTiles();
		let array = new Array();
		matrixToLineArray(matrix, array);
		this._view.facade({
			"fallTiles": array,
		});
		//Add tailes for empty cell
		matrix = this.objectRegister.Field[0].addTiles(this.amountWariablesColors)
		matrixToLineArray(matrix, this.objectRegister.Tile);
		this._view.facade({
			"addTiles": this.objectRegister.Tile
		});
	}
	countParametersOfLevel(arrayTiles) {
		//This method recount parameters of Level
		//One blasted tile +10 points
		console.log("Start Model.countParametresOfLevel()");
		let addPoints = arrayTiles.length * 10
		this.points += addPoints;
		this.progress += (addPoints / this.goal) * 100;
		this.moves--;
		let addres = this.objectRegister.ParametersOfGame;
		addres.progress = this.progress;
		addres.points = this.points;
		addres.moves = this.moves;
		console.log("----------------");
		console.log("Points:" + this.points + " Progress:" + this.progress + " Moves:" + this.moves);
		console.log("----------------");
		this.checkEndGame();
	}
	checkEndGame() {
		console.log("Start Model.checkEndGame()");
		let canDoNextMove = false;
		if (this.checkPossibleBlast(this.objectRegister.Field[0], this.amountTilesForBlast)) {
			console.log("ALL OK CAN DO NEXT MOVE");
			
		} else {
			console.warn("NO AVAILABLE FOR BLAST");
			for (let i = 0; i < this.amountMixing; i++) {
				let copyField = this.copyField(this.objectRegister.Field[0]);
				this._view.facade({
					"mixTiles": copyField
				});
				if (this.checkPossibleBlast(this.objectRegister.Field[0], this.amountTilesForBlast)) {
					i = this.amountMixing;
					canDoNextMove = true;
                }
			}

		}
		//-------------------------------------
		if (this.points >= this.goal) {
			console.log("--------WINS--------");
			this._view.facade({
				"drawWin" : "WIN"
			});
			this.amountTilesForBlast = 9999;
			this._view.facade({
				"drawWin" : "Win"
			});
		} else if (this.moves <= 0 && !canDoNextMove) {
			console.log("--------LOSE--------");
			this.amountTilesForBlast = 9999;
			this._view.facade({
				"drawLose" : "Lose"
			});
        }
	}
	checkPossibleBlast(field,amountTileForBlust=2) {
		//Return true or false for possibility a move
		let matrix = field._matrixOfTiles;
		for (let i = 0; i < matrix.length; i++) {
			for (let k = 0; k < matrix[i].length; k++) {
				let arrayTiles = this.getArrayTilesWithSameColor(matrix[i][k]);
				let amount = arrayTiles.length;
				if (amount >= amountTileForBlust) {
					return true;
                }
            }
		}
		return false;

    }
	createButtons() {
		this.objectRegister.Button.push(new PauseButton("pauseButton1"));
		this.objectRegister.Button.push(new NextButton("nextButton1"));
		this.objectRegister.Button.push(new RepeatButton("repeatButton1"));
		this.objectRegister.Button.push(new MenuButton("menuButton1"));
	}
	getArrayTilesWithSameColor(tile) {
		console.log("Start Controler.getArrayTilesWithSameColor()");
		/*
		The recursive method is based on the "raised hand" principle.
		When a method is called for a neighboring tile of similar color,
		it puts itself in the array and "lowers its hand".
		*/
		let arrayTiles = new Array();
		this.getArrayTilesWithSameColorRec(tile, arrayTiles);
		tile._field.linkTiles();
		return arrayTiles;
	}
	getArrayTilesWithSameColorRec(tile, arrayTiles) {
		tile.isCounted = true;
		arrayTiles.push(tile);
		let idColor = tile._color;
		if (tile.leftTile != null && tile.leftTile.isCounted == false) {
			if (idColor == tile.leftTile._color) {
				this.getArrayTilesWithSameColorRec(tile.leftTile, arrayTiles);
			}
		}
		if (tile.upTile != null && tile.upTile.isCounted == false) {
			if (idColor == tile.upTile._color) {
				this.getArrayTilesWithSameColorRec(tile.upTile, arrayTiles);
			}
		}
		if (tile.rightTile != null && tile.rightTile.isCounted == false) {
			if (idColor == tile.rightTile._color) {
				this.getArrayTilesWithSameColorRec(tile.rightTile, arrayTiles);
			}
		}
		if (tile.bottomTile != null && tile.bottomTile.isCounted == false) {
			if (idColor == tile.bottomTile._color) {
				this.getArrayTilesWithSameColorRec(tile.bottomTile, arrayTiles);
			}
		}

		return arrayTiles;
	}
	copyField(field) {
		let matrixOriginField = field._matrixOfTiles;
		let copyField = new Field(matrixOriginField[0].length, matrixOriginField.length);
		for (let i = 0; i < copyField._matrixOfTiles.length; i++) {
			for (let k = 0; k < copyField._matrixOfTiles[i].length; k++) {
				let originTile = matrixOriginField[i][k];
				let originColor = originTile._color;
				copyField._matrixOfTiles[i][k] = new Tile(i + " " + k, originColor, copyField, i, k);
				copyField._matrixOfTiles[i][k].proto = originTile;
				copyField._matrixOfTiles[i][k].X = originTile.X;
				copyField._matrixOfTiles[i][k].Y = originTile.Y;
			}
		}
		return copyField;
    }
	testing() {
		//Test-------------------
		let testField = this.objectRegister.Field[0];
		for (let i = 0; i < 40; i++) {
			let bool = this.checkPossibleBlast(testField, i);
			console.log(i + ": " + bool);
		}
		//Test--------------------
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
				this._matrixOfTiles[i][k].row = i;
				this._matrixOfTiles[i][k].column = k;
				this._matrixOfTiles[i][k].isCounted = false;
				this._matrixOfTiles[i][k].leftTile = null;
				this._matrixOfTiles[i][k].upTile = null;
				this._matrixOfTiles[i][k].rightTile = null;
				this._matrixOfTiles[i][k].bottomTile = null;
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
	mixTiles() {
		console.log("Start Field.mixTiles");
		let arrayTiles = new Array();
		for (let i = 0; i < this._matrixOfTiles.length; i++) {
			for (let k = 0; k < this._matrixOfTiles[i].length; k++) {
				arrayTiles.push(this._matrixOfTiles[i][k]);
            }
		}
		let j = 0;
		for (let i = 0; i < this._matrixOfTiles.length; i++) {
			for (let k = 0; k < this._matrixOfTiles[i].length; k++) {
				let index = 0;
				if (j % 2 == 0) {
					index = arrayTiles.length - j - 1;
				} else {
					index = j;
				}
				this._matrixOfTiles[i][k] = arrayTiles[index];
				j++;
			}
		}
		//Check new matrix
		let errorFlag = false;
		for (let i = 0; i < this._matrixOfTiles.length; i++) {
			for (let k = 0; k < this._matrixOfTiles[i].length; k++) {
				if (arrayTiles.indexOf(this._matrixOfTiles[i][k]) == -1) {
					console.warn("Error mix tiles! Field.mixTile()");
					errorFlag = true;
                }
			}
		}
		if (errorFlag) {
			let x = 0;
			for (let i = 0; i < this._matrixOfTiles.length; i++) {
				for (let k = 0; k < this._matrixOfTiles[i].length; k++) {
					this._matrixOfTiles[i][k] = arrayTiles[x];
					x++;
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
class Button extends Obj {
	_id;
	constructor(id="unkown") {
		super();
		this._id = id;
    }
}
class PauseButton extends Button {
	constructor(id) {
		super(id);
    }
}
class NextButton extends Button {
	constructor(id) {
		super(id);
    }
}
class RepeatButton extends Button {
	constructor(id) {
		super(id);
	}
}
class MenuButton extends Button {
	constructor(id) {
		super(id);
	}
}