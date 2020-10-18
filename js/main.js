class Game {
	_resources = {};
	_loadPromise;

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
}
class Field{   
	_width;     
	_height;
	_X;
	_Y;
	_amountTiles;
	_img;
	_game;
	_arrayTiles;
	_arrayTilesForDraw;
	_widthTile;
	_padding;
	//Attr: width and height field in px,
	//coordinators from a left up corner in px,
	//amount tiles, context of parrent
	constructor(widthField = 0, heightField = 0, X = 0, Y = 0, amountTiles = 0, img = null, game = null) {
		this._game = game;
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
		for (let i = 0; i < amountInWidth; i++){
			let arr = new Array();
			for(let k=0; k<amountInHeight; k++){
				arr[k] = null;
			}
			this._arrayTiles[i] = arr;
		}
	}
	//This methid create tiles for field
	craeteTiles(amountColors) {
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
				let img = this._game._resources.imgTile[colorNumber];
				let x = this._X + i * this._widthTile + marginX;
				let y = this._Y + k * this._widthTile + marginY;
				this._arrayTiles[i][k] = new Tile(widthTile, heightTile, x, y, img, i + " " + k, colorNumber);
				this._arrayTilesForDraw.push(this._arrayTiles[i][k]);
			}
		}
		for(let i=0; i<this._arrayTiles.length; i++){
			for(let k=0; k<this._arrayTiles[i].length; k++){
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
	constructor(width = 0, height = 0, X = 0, Y = 0, img = null, id = -1, color = 1, leftTile = null, upTile = null, rightTile = null, bottomTile = null) {
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
	}
}
class Rendering {
	drawImg(object, ctxCanvas) {
		ctxCanvas.drawImage(object._img, object._X, object._Y, object._width, object._height);
	}
	drawAll(arrayObjects, ctxCanvas, delay = 0) {
		for (let i = 0; i < arrayObjects.length; i++) {
			setTimeout(() => {
				ctxCanvas.drawImage(arrayObjects[i]._img, arrayObjects[i]._X, arrayObjects[i]._Y, arrayObjects[i]._width, arrayObjects[i]._height);
			}, delay*i);
        }
	}
}