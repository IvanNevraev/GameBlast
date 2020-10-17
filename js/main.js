class Game {
	_colors = ["BlueTile.png", "RedTile.png", "GreenTile.png", "PurpleTile.png", "YellowTile.png"];
	_imgTiles;
	_loadPromise;
	_canvas;

	constructor(canvas) {
		this._canvas = canvas;
	}
	loadResourses() {
		this._loadPromise = new Promise((resolve, reject) => {
			this._imgTiles = new Array();
			let flag = 0;
			for (let i = 0; i < this._colors.length; i++) {
				let img = new Image();
				img.src = "img/" + this._colors[i];
				img.onload = () => {
					flag++;
					if (flag == this._colors.length) {
						resolve(flag);
					}
				}
				this._imgTiles.push(img);
			}
		});
	}
}
class Field{   
	_amountTiles; 
	_widthTile;
	_widthField;     
	_heightField;
	_X;
	_Y;
	_arrayTiles;
	_parrent;
	//Attr: width and height field in px,
	//coordinators from a left up corner in px,
	//amount tiles, context of parrent
	constructor(widthField = 0, heightField = 0, X = 0, Y = 0, amountTiles = 0, parrent = null) {
		this._parrent = parrent;
		this._widthField = widthField;
		this._heightField = heightField;
		this._X = X;
		this._Y = Y;
		this._amountTiles = amountTiles;
		this._arrayTiles = new Array();
		let widthTile = Math.sqrt(widthField * heightField / amountTiles);
		let amountInWidth = Math.round(widthField / widthTile);
		let amountInHeight = Math.round(heightField / widthTile);
		this._widthTile = widthField / amountInWidth;
		for (let i = 0; i < amountInHeight; i++){
			let arr = new Array();
			for(let k=0; k<amountInWidth; k++){
				arr[k] = null;
			}
			this._arrayTiles[i] = arr;
		}
	}
	drawMyself(imgPath,ctxCanvas){
		let width = this._widthField;
		let height = this._heightField;
		let img = new Image();
		img.src = imgPath;
		img.onload = () => {
			img.width = width;
			img.height = height;
			ctxCanvas.drawImage(img,this._X, this._Y, width, height);
		}
	}
	fillTiles(amountColors){
		
		for(let i=0; i<this._arrayTiles.length; i++){
			for(let k=0; k<this._arrayTiles[i].length; k++){
				this._arrayTiles[i][k] = new Tile(i+" "+k,randomInteger(0,amountColors-1));
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
	drawTiles(ctxCanvas) {
		for (let i = 0; i < this._arrayTiles.length; i++) {
			for (let k = 0; k < this._arrayTiles[i].length; k++) {
				let colorNumber = this._arrayTiles[i][k]._color;
				let img = this._parrent._imgTiles[colorNumber];
				let x = this._X + i * this._widthTile;
				let y;
				if (k == 0) {
					y = this._Y + k * this._widthTile;
				} else {
					y = this._Y + k * this._widthTile - 10;
				}
				let width = this._widthTile;
				let height = this._widthTile;
				ctxCanvas.drawImage(img, x, y, width, height);
			}
		}
	}
}
class Tile{
	_id;
	_color;
	_leftTile;
	_upTile;
	_rightTile;
	_bottomTile;
	constructor(id = -1, color = 1, leftTile = null, upTile = null, rightTile = null, bottomTile = null) {
		this._id = id;
		this._color = color;
		this._leftTile = leftTile;
		this._upTile = upTile;
		this._rightTile = rightTile;
		this._bottomTile = bottomTile;
	}
}