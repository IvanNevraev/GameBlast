//const used colors 
const COLORS = ["BlueTile.png","RedTile.png","GreenTile.png","PurpleTile.png","YellowTile.png"];
class Field {
	_widthTile = 50;    
	_heightTile = 50; 
	_widthField;     
	_heightField;
	_X;
	_Y;
	_arrayTiles;
	//Attr: ammont tiles for width, amount tiles for height
	//coordinators from a left up corner in px
	constructor(widthField=0,heightField=0,X=0,Y=0){
		this._widthField = widthField;
		this._heightField = heightField;
		this._X = X;
		this._Y = Y;
		this._arrayTiles = new Array();
		for(let i=0; i<heightField; i++){
			let arr = new Array();
			for(let k=0; k<widthField; k++){
				arr[k] = null;
			}
			this._arrayTiles[i] = arr;
		}
	}
	drawMyself(ctxCanvas){
		let width = this._widthField * this._widthTile;
		let height = this._heightField * this._heightTile;
		let img = new Image();
		img.src = "img/Field.png";
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
	drawTiles(ctxCanvas){
		let imegs = new Array();
		for(let i=0;i<COLORS;i++){
			images[i] = new Image();
			images[i].src = "img/"+COLORS[i];
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
	constructor(id = -1,color=1,leftTile=null,upTile=null,rightTile=null,bottomTile=null){
		this._id = id;
		this._color = color;
		this._leftTile = leftTile;
		this._upTile = upTile;
		this._rightTile = rightTile;
		this._bottomTile = bottomTile;
	}
}