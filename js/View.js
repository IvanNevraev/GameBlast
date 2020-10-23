class View{
	/*
	 This class draws all objects. Loads the required resources. 
	 Sets physical parameters for objects so that the controller can then identify them.
	 */
	_ctxCanvas;
	_loadPromise; //This promise ensures that all resources are loaded
	_drawPromise; //this promise controls the render queue
	_nameOfImages;
	_images = {};
	objectRegister = {};
	preState = {};
	constructor(objectRegister, ctxCanvas, nameOfImages) {
		this.objectRegister = objectRegister;
		this._ctxCanvas = ctxCanvas;
		this._nameOfImages = nameOfImages;
		this.loadResourses();
		console.log(this);
	}
	loadResourses() {
		this._loadPromise = new Promise((resolve, reject) => {
			let flag = 0;
			for(let key in this._nameOfImages){
				if(key!="puthToFiles"&&key!="amountOfFiles"){
					this._images[key] = new Array();
					for (let i = 0; i < this._nameOfImages[key].length; i++) {
						let img = new Image();
						img.src = this._nameOfImages.puthToFiles+this._nameOfImages[key][i];
						img.onload = () => {
							flag++;
							if (flag == this._nameOfImages["amountOfFiles"]) {
								resolve(flag);
							}
						}
						this._images[key].push(img);
					}
				}
			}
		});
	}
	draw() {
		this._loadPromise.then((result) => {
			console.log("Start View.draw()");
			this.drawField(this.objectRegister.Field[0], 1);
			this.drawAllTiles(this.objectRegister.Tile, 0);
			this.saveState();
		},(reject)=>{});
    }
	drawField(field,Z){
		//Set phisical parametrs and draw
		//Field are in center window all time
		field.Z = Z;
		field.img = this._images.Field[0];
		//Get size window
		let widthWindow = document.documentElement.clientWidth;
		let heightWindow = document.documentElement.clientHeight;
		//Index width/height field
		let widthInTiles = field._matrixOfTiles[0].length;
		let heightInTiles = field._matrixOfTiles.length;
		if(widthInTiles>heightInTiles){
			//Centering in width
			field.width = widthWindow*0.6;
			field.height = field.width*(heightInTiles/widthInTiles);
			field.X = widthWindow*0.2;
			field.Y = (heightWindow/2)-(field.height/2);
		}else{
			//Centering in height
			field.height = heightWindow*0.6;
			field.width = field.height*(widthInTiles/heightInTiles);
			field.X = (widthWindow/2)-(field.width/2);
			field.Y = heightWindow*0.2;
		}
		this.drawImage(field);
	}
	drawTile(tile){
		//Set image for tile
		tile.img = this._images.Tile[tile._color];
		//Get phisical parametrs of tile`s field
		let xField = tile._field.X;
		let yField = tile._field.Y;
		let widthField = tile._field.width;
		let heightField = tile._field.height;
		let widthInTiles = tile._field._matrixOfTiles[0].length;
		let heightInTiles = tile._field._matrixOfTiles.length;
		//Set phisical parametrs for tile
		tile.Z = tile._field.Z+1;
		tile.width = (widthField*0.9)/widthInTiles;
		tile.height = (heightField*0.9)/heightInTiles;
		tile.X = xField+(tile.width*tile.column)+widthField*0.05;
		tile.Y = yField+(tile.height*tile.row)+heightField*0.05;
		this.drawImage(tile);
	}
	drawAllTiles(tiles, delay = 0) {
		for (let i = 0; i < tiles.length; i++){
			if (tiles[i] != null) {
				setTimeout(() => {
					this.drawTile(tiles[i]);
				}, delay * i);
			}
		}
	}
	drawImage(object) {
		this._ctxCanvas.drawImage(object.img, object.X, object.Y, object.width, object.height);
	}
	facade(object){
		//Any requests from the model come here
		//{"What will we do" : arrayOfChangetObjects}
		for(let key in object){
			if(key=="blastTiles"){
				this.blastTiles(object[key]);
			}
		}
	}
	saveState(){
		//This method save previous states of objects
		for(let key in this.objectRegister){
			let currentArray = this.objectRegister[key];
			let newArray = new Array();
			for(let i=0; i<currentArray.length; i++){
				newArray[i] = currentArray[i];
			}
			this.preState[key] = newArray;
		}
	}
	blastTiles(array) {
		console.log("Start View.blastTiles()");
		let k = 0;
		let kd = 0;
		let delay = 50;
		this._drawPromise = new Promise((resolve,reject)=>{
			for(let item of array){
				setTimeout(()=>{
					this.drawField(this.preState.Field[0], this.preState.Field[0].Z);
					let i = this.preState.Tile.indexOf(item);
					this.preState.Tile[i] = null;
					for(let tile of this.preState.Tile){
						if(tile==null){
							continue;
						}
						this.drawTile(tile);
					}
					kd++;
					if(kd==k){
						resolve("finish");
					}
				},delay*k);
				k++;
			}
		});
		this._drawPromise.then((resolve)=>{
			console.log(resolve);
		},(reject)=>{});
    }
}