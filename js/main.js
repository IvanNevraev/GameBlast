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
	onlistener(elemDom) {
		elemDom.addEventListener('mousemove', (event) => {
			//console.log(event.offsetX + " " + event.offsetY);
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
	_game;
	_padding;
	//Attr: width and height field in px,
	//coordinators from a left up corner in px,
	//amount tiles, context of parrent
	constructor(widthField = 0, heightField = 0, X = 0, Y = 0, amountTiles = 0, game = null) {
		this._game = game;
		this._widthField = widthField;
		this._heightField = heightField;
		this._X = X;
		this._Y = Y;
		this._amountTiles = amountTiles;
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
class Rendering {

	drawField(field, imgPath, ctxCanvas) {
		let width = field._widthField;
		let height = field._heightField;
		let img = new Image();
		img.src = imgPath;
		img.onload = () => {
			img.width = width;
			img.height = height;
			ctxCanvas.drawImage(img, field._X, field._Y, width, height);
		}
	}
	drawTiles(field,imgTailes,ctxCanvas) {
		let width = field._widthTile;
		let height = field._widthTile;
		let minSide = field._widthField < field._heightField ? "width" : "height";
		let marginX = field._padding / 2;
		let marginY = field._padding / 2;
		if (field._widthField != field._heightField) {
			if (minSide == "width") {
				marginX = (field._widthField / field._heightField) * marginX;
			} else {
				marginY = (field._heightField / field._widthField) * marginY;
			}
		}
		for (let i = 0; i < field._arrayTiles.length; i++) {
			for (let k = 0; k < field._arrayTiles[i].length; k++) {
				let colorNumber = field._arrayTiles[i][k]._color;
				let img = imgTailes[colorNumber];
				let x = field._X + i * field._widthTile + marginX;
				let y = field._Y + k * field._widthTile + marginY;
				ctxCanvas.drawImage(img, x, y, width, height);
			}
		}
	}
}