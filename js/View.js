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
	buildeLevel() {
		console.log("Start View.buildeLevel()");
		this.drawField(this.objectRegister.Field[0], 1);
		this.drawAllTiles(this.objectRegister.Tile, 50);
		this._drawPromise.then((resolve) => {
			this.saveState();
		});
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
		console.log("Start View.drawAllTiles()");
		let k = 0;
		let kd = 0;
		this._drawPromise = new Promise((resolve, reject) => {
			for (let i = 0; i < tiles.length; i++) {
				if (tiles[i] != null) {
					setTimeout(() => {
						this.drawTile(tiles[i]);
						kd++;
						if (kd == k) {
							resolve("Finish View.drawAllTiles()");
                        }
					}, delay * i);
					k++;
				}
			}
		});
	}
	drawImage(object) {
		this._ctxCanvas.drawImage(object.img, object.X, object.Y, object.width, object.height);
	}
	facade(object){
		//Any requests from the model come here
		//{"What will we do" : arrayOfChangetObjects}
		Promise.all([this._loadPromise, this._drawPromise]).then((value) => {
			for (let key in object) {
				if (key == "blastTiles") {
					this.blastTiles(object[key]);
				} else if (key == "buildeLevel") {
					this.buildeLevel();
				} else if (key == "fallTiles") {
					this.fallTiles(object[key]);
                }
			}
		}, (reason) => { });
	}
	saveState(){
		//This method save previous states of objects
		console.log("Start View.saveState()");
		for(let key in this.objectRegister){
			let currentArray = this.objectRegister[key];
			let newArray = new Array();
			for (let i = 0; i < currentArray.length; i++){
				let o;
				if (currentArray[i] instanceof Tile) {
					o = new Tile();
				} else if (currentArray[i] instanceof Field) {
					o = new Field();
                }
				newArray[i] = o;
				for (let k in currentArray[i]) {
					o[k] = currentArray[i][k];
				}
				o["proto"] = currentArray[i];
			}
			this.preState[key] = newArray;
		}
	}
	findProto(object) {
		//This method searches for the object based on which the copy was created
		for (let key in this.preState) {
			if (this.preState[key] instanceof Array) {
				for (let item of this.preState[key]) {
					if (item == null) {
						continue;
                    }
					if (item.proto == object) {
						return item;
                    }
                }
            }
		}
		return null;
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
					let i = this.preState.Tile.indexOf(this.findProto(item));
					this.preState.Tile[i] = null;
					for(let tile of this.preState.Tile){
						if(tile==null){
							continue;
						}
						this.drawTile(tile);
					}
					kd++;
					if(kd==k){
						resolve("Finish View.blastTiles()");
					}
				},delay*k);
				k++;
			}
		});
	}
	fallTiles(array) {
		console.log("Start View.fallTiles()");
		let tileForFall = new Array();
		let tileForStay = new Array();
		for (let item of array) {
			if (item == null) {
				continue;
            }
			let copyTile = this.findProto(item);
			if (copyTile.row != item.row) {
				let newY = copyTile.Y + (item.row - copyTile.row) * copyTile.height;
				tileForFall.push({
					"copyTile": copyTile,
					"startRow": copyTile.row,
					"finishRow": item.row,
					"startY": copyTile.Y,
					"finishY": newY
				});
			} else {
				tileForStay.push(copyTile);
            }
		}
		let k = 0;
		let kd = 0;
		let delay = 5;
		let cadrs = 50;
		this._drawPromise.then((resolve) => {
			console.log(resolve);
			this._drawPromise = new Promise((resolve, reject) => {
				for (let i = 0; i < cadrs; i++) {
					setTimeout(() => {
						this.drawField(this.preState.Field[0]);
						for (let item of tileForStay) {
							this.drawImage(item);
                        }
						for (let item of tileForFall) {
							let deltaY = (item.finishY - item.startY) / cadrs;
							item.copyTile.Y = item.copyTile.Y + deltaY;
							this.drawImage(item.copyTile);
						}
						kd++;
						if (kd == k) {
							resolve("Finish View.fallTiles()");
                        }
					}, delay * i);
					k++;
				}
			});
		});
		console.log(tileForFall);
    }
}