class Game {
	_resources = {};
	_loadPromise;
	_objects = {};
	_amountTilesForBlast = 2;

	constructor() {
	}
	loadResourses(resourcesPath) {
		this._loadPromise = new Promise((resolve, reject) => {
			let flag = 0;
			for (let key in resourcesPath) {
				if (key != "puthToResources") {
					this._resources[key] = new Array();
					for (let i = 0; i < resourcesPath[key].length; i++) {
						let img = new Image();
						img.src = resourcesPath["puthToResources"] + resourcesPath[key][i];
						img.onload = () => {
							flag++;
							if (flag == resourcesPath["amountResources"]) {
								resolve(flag);
							}
						}
						this._resources[key].push(img);
                    }
                }
            }
		});
	}
	begin(){
		
	}
}
class Field{   
	_width;     
	_height;
	_X;
	_Y;
	_amountTiles;
	_img;
	_arrayTiles;
	_arrayTilesForDraw;
	_widthTile;
	_padding;
	constructor(widthField = 0, heightField = 0, X = 0, Y = 0, amountTiles = 0, img = null) {
		this._width = widthField;
		this._height = heightField;
		this._X = X;
		this._Y = Y;
		this._amountTiles = amountTiles;
		this._img = img;
		this._arrayTiles = new Array();
		let widthTile = Math.sqrt(widthField * heightField / amountTiles);
		let amountInWidth = Math.round(widthField / widthTile);
		let amountInHeight = Math.round(heightField / widthTile);
		this._padding = widthField * 0.1;
		this._widthTile = (widthField - this._padding) / amountInWidth;
		for (let i = 0; i < amountInHeight; i++){
			let arr = new Array();
			for(let k=0; k<amountInWidth; k++){
				arr[k] = null;
			}
			this._arrayTiles[i] = arr;
		}
	}
	//This method create tiles for field
	craeteTiles(amountColors,arrayImg) {
		this._arrayTilesForDraw = new Array();
		let widthTile = this._widthTile;
		let heightTile = this._widthTile;
		let minSide = this._widthField < this._heightField ? "width" : "height";
		let marginX = this._padding / 2;
		let marginY = this._padding / 2;
		if (this._widthField != this._heightField) {
			if (minSide == "width") {
				marginX = (this._widthField / this._heightField) * marginX;
			} else {
				marginY = (this._heightField / this._widthField) * marginY;
			}
		}
		for(let i=0; i<this._arrayTiles.length; i++){
			for (let k = 0; k < this._arrayTiles[i].length; k++){
				let colorNumber = randomInteger(0, amountColors - 1);
				let img = arrayImg[colorNumber];
				let x = this._X + k * this._widthTile + marginX;
				let y = this._Y + i * this._widthTile + marginY;
				this._arrayTiles[i][k] = new Tile(widthTile, heightTile, x, y, img, i + " " + k, colorNumber,null,null,null,null,this);
				this._arrayTilesForDraw.push(this._arrayTiles[i][k]);
			}
		}
	}
	linkTiles(){
		for(let i=0; i<this._arrayTiles.length; i++){
			for(let k=0; k<this._arrayTiles[i].length; k++){
				this._arrayTiles[i][k]._isCounted = false;
				if(k-1>=0){
					this._arrayTiles[i][k]._leftTile = this._arrayTiles[i][k-1];
				}
				if(i-1>=0){
					this._arrayTiles[i][k]._upTile = this._arrayTiles[i-1][k];
				}
				if(k+1<this._arrayTiles[i].length){
					this._arrayTiles[i][k]._rightTile = this._arrayTiles[i][k+1];
				}
				if(i+1<this._arrayTiles.length){
					this._arrayTiles[i][k]._bottomTile = this._arrayTiles[i+1][k];
				}
			}
		}
	}
}
class Tile{
	_width;
	_height;
	_X;
	_Y;
	_img;
	_id;
	_color;
	_leftTile;
	_upTile;
	_rightTile;
	_bottomTile;
	_field;
	_isCounted = false;
	constructor(width = 0, height = 0, X = 0, Y = 0, img = null, id = -1, color = 1, leftTile = null, upTile = null, rightTile = null, bottomTile = null, field=null) {
		this._width = width;
		this._height = height;
		this._X = X;
		this._Y = Y;
		this._img = img;
		this._id = id;
		this._color = color;
		this._leftTile = leftTile;
		this._upTile = upTile;
		this._rightTile = rightTile;
		this._bottomTile = bottomTile;
		this._field = field;
	}
}