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
		this._drawPromise = new Promise((resolve, reject) => {
			resolve("This is first promise.");
		});
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
								resolve("All images is downloaded. Amount:"+flag);
							}
						}
						this._images[key].push(img);
					}
				}
			}
		});
	}
	drawLevel() {
		console.log("Start View.drawLevel()");
		//Rest button parameters
		for (let item of this.objectRegister.Button) {
			if (item instanceof MenuButton || item instanceof RepeatButton || item instanceof NextButton) {
				this.drawButton(item, this._images.Button[1]);
            }
        }
		//Draw new level
		let addres = this.objectRegister.ParametersOfGame;
		this.drawBackground();
		this.drawPauseButton();
		this.drawProgress();
		this.drawPanelScope(addres.points, addres.moves, addres.level);
		this.drawField(this.objectRegister.Field[0], 1);
		this.drawAllTiles(this.objectRegister.Tile, 50);
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.saveState() on View.drawLevel()");
				this.saveState();
				this.objectRegister.isControled = true;
				resolve("Finish View.saveState() on View.drawLevel()");
			});
		});
		this._drawPromise = newPromise;
    }
	drawField(field, Z = 0) {
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
		if (widthInTiles == heightInTiles) {
			if (widthWindow > heightWindow) {
				field.height = heightWindow * 0.6;
				field.width = field.height;
				field.X = (widthWindow / 2) - (field.width / 2);
				field.Y = heightWindow * 0.2;
			} else {
				field.width = widthWindow * 0.6;
				field.height = field.width;
				field.X = (widthWindow / 2) - (field.width / 2);
				field.Y = heightWindow * 0.2;
            }
        }else if(widthInTiles>heightInTiles){
			//Centering in width
			field.width = widthWindow*0.6;
			field.height = field.width*(heightInTiles/widthInTiles);
			field.X = widthWindow*0.2;
			field.Y = heightWindow*0.2;
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
		let k = 0;
		let kd = 0;
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.drawAllTiles()");
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
		});
		this._drawPromise = newPromise;
	}
	drawImage(object) {
		this._ctxCanvas.drawImage(object.img, object.X, object.Y, object.width, object.height);
	}
	facade(object){
		//Any requests from the model come here
		//{"What will we do" : arrayOfChangetObjects}
		this._loadPromise.then((resolve) => {
			for (let key in object) {
				if (key == "blastTiles") {
					this.blastTiles(object[key]);
				} else if (key == "drawLevel") {
					this.drawLevel();
				} else if (key == "fallTiles") {
					this.fallTiles(object[key]);
				} else if (key == "addTiles") {
					this.addTiles(object[key]);
				} else if (key == "drawWin") {
					this.drawWin();
				} else if (key == "drawLose") {
					this.drawLose();
				} else if (key == "mixTiles") {
					this.mixTiles(object[key]);
                }
			}
		}, (reject) => { });
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
				} else if (currentArray[i] instanceof Button) {
					o = new Button;
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
		let k = 0;
		let kd = 0;
		let delay = 50;
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.blastTiles()");
				this.objectRegister.isControled = false;
				for (let item of array) {
					setTimeout(() => {
						this.drawField(this.preState.Field[0], this.preState.Field[0].Z);
						let i = this.preState.Tile.indexOf(this.findProto(item));
						this.preState.Tile[i] = null;
						for (let tile of this.preState.Tile) {
							if (tile == null) {
								continue;
							}
							this.drawTile(tile);
						}
						kd++;
						if (kd == k) {
							resolve("Finish View.blastTiles()");
						}
					}, delay * k);
					k++;
				}
			});
		});
		this._drawPromise = newPromise;
	}
	fallTiles(array) {
		let k = 0;
		let kd = 0;
		let delay = 5;
		let cadrs = 50;
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
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
						let startRow = copyTile.row;
						let newRow = item.row;
						copyTile.row = newRow;
						tileForFall.push({
							"copyTile": copyTile,
							"startRow": startRow,
							"finishRow": newRow,
							"startY": copyTile.Y,
							"finishY": newY
						});
						item.row = newRow;
						item.Y = newY;
					} else {
						tileForStay.push(copyTile);
					}
				}
				for (let i = 0; i < cadrs; i++) {
					setTimeout(() => {
						this.drawField(this.preState.Field[0], this.preState.Field[0].Z);
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
		this._drawPromise = newPromise;
	}
	addTiles(array) {
		let k = 0;
		let kd = 0;
		let delay = 50;
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.addTiles()");
				let tilesForAdded = new Array();
				let tilesForStay = new Array();
				for (let i = 0; i < array.length; i++) {
					//No new tiles is this.preState, mean, we should add it
					if (this.findProto(array[i]) == null) {
						//This tile are for added
						tilesForAdded.push(array[i]);
					} else {
						tilesForStay.push(array[i]);
					}
				}
				for (let item of tilesForAdded) {
					setTimeout(() => {
						this.drawField(this.preState.Field[0], this.preState.Field[0].Z);
						for (let i of tilesForStay) {
							this.drawTile(i);
						}
						this.drawTile(item);
						tilesForStay.push(item);
						kd++;
						if (kd == k) {
							let addres = this.objectRegister.ParametersOfGame;
							this.drawProgress(addres.progress);
							this.drawPanelScope(addres.points, addres.moves, addres.level);
							this.saveState();
							this.objectRegister.isControled = true;
							resolve("Finish View.addTiles()");
							console.log("--------End of turn--------");
						}
					}, delay * k);
					k++;
				}
			});
		});
		this._drawPromise = newPromise;
	}
	mixTiles(copyField) {
		let k = 0;
		let kd = 0;
		let delay = 20;
		let cadrs = 60;
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.mixTiles()");
				this.objectRegister.isControled = false;
				let newMatrix = copyField.mixTiles();
				let array = new Array();
				matrixToLineArray(newMatrix,array);
				let tileForMix = new Array();
				for (let newPositionTile of array) {
					if (newPositionTile == null) {
						continue;
					}
					let lastPositionTile = this.findProto(newPositionTile.proto);
					let startRow = lastPositionTile.row;
					let newRow = newPositionTile.row;
					let startY = lastPositionTile.Y;
					let newY = startY + (newRow - startRow) * lastPositionTile.height;
					let startColumn = lastPositionTile.column;
					let newColumn = newPositionTile.column;
					let startX = lastPositionTile.X;
					let newX = startX + (newColumn - startColumn) * lastPositionTile.width;
					lastPositionTile.row = newRow;
					tileForMix.push({
						"copyTile": lastPositionTile,
						"startRow": startRow,
						"finishRow": newRow,
						"startY": startY,
						"finishY": newY,
						"startColumn": startColumn,
						"finishColumn": newColumn,
						"startX": startX,
						"finishX": newX,
					});
					newPositionTile.row = newRow;
					newPositionTile.Y = newY;
					newPositionTile.column = newColumn;
					newPositionTile.X = newX;
				}
				for (let i = 0; i < cadrs; i++) {
					setTimeout(() => {
						this.drawField(this.preState.Field[0], this.preState.Field[0].Z);
						for (let item of tileForMix) {
							let deltaY = (item.finishY - item.startY) / cadrs;
							let deltaX = (item.finishX - item.startX) / cadrs;
							item.copyTile.Y = item.copyTile.Y + deltaY;
							item.copyTile.X = item.copyTile.X + deltaX;
							this.drawImage(item.copyTile);
						}
						kd++;
						if (kd == k) {
							//Update parametrs to origin field
							let originMatrix = this.objectRegister.Field[0].mixTiles();
							for (let i = 0; i < originMatrix.length; i++) {
								for (let k = 0; k < originMatrix[i].length; k++) {
									originMatrix[i][k].X = newMatrix[i][k].X;
									originMatrix[i][k].Y = newMatrix[i][k].Y;
                                }
                            }
							//----------------------------------
							this.saveState();
							this.objectRegister.isControled = true;
							resolve("Finish View.mixTiles()");
						}
					}, delay * i);
					k++;
				}
				
			});
		});
		this._drawPromise = newPromise;
    }
	drawBackground() {
		console.log("Start View.drawBackground()");
		this._ctxCanvas.drawImage(this._images.Background[0], 0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
	}
	drawPauseButton() {
		console.log("Start View.drawPauseButton()");
		for (let item of this.objectRegister.Button) {
			if (item instanceof PauseButton) {
				let widthWindow = document.documentElement.clientWidth;
				let width = widthWindow * 0.1
				item.X = widthWindow - 20 - width;
				item.Y = 20;
				item.width = width;
				item.height = width;
				item.Z = 1;
				item.img = this._images.Button[0];
				this.drawImage(item);
            }
        }
	}
	drawProgress(percent = 0) {
		percent = percent > 100 ? 100 : percent;
		let widthWindow = document.documentElement.clientWidth;
		let heightWindow = document.documentElement.clientHeight;
		let widthBackgroundProgress;
		let heightBackgroundProgress;
		let xBackgroundProgress;
		let yBackgroundProgress;
		if (widthWindow >= heightWindow) {
			heightBackgroundProgress = heightWindow * 0.2 - 40;
			widthBackgroundProgress = heightBackgroundProgress*3.5;
			xBackgroundProgress = (widthWindow/2) -(widthBackgroundProgress/2);
			yBackgroundProgress = 30;
		} else {
			widthBackgroundProgress = widthWindow * 0.6;
			heightBackgroundProgress = heightWindow * 0.2 - 40;
			xBackgroundProgress = widthWindow * 0.2;
			yBackgroundProgress = 20;
        }
		let imageBackgroundProgress = this._images.Progress[0];
		this._ctxCanvas.drawImage(imageBackgroundProgress, xBackgroundProgress, yBackgroundProgress, widthBackgroundProgress, heightBackgroundProgress);
		let fullFillBarProgress = widthBackgroundProgress * 0.853;

		//Draw progress bar
		let width = fullFillBarProgress * percent/100;
		let height = heightBackgroundProgress * 0.23;
		let xBar = xBackgroundProgress + widthBackgroundProgress * 0.072;
		let yBar = yBackgroundProgress + heightBackgroundProgress * 0.6;
		let gr = this._ctxCanvas.createLinearGradient(xBar + (width / 2), yBar, xBar + (width / 2), yBar + height);
		gr.addColorStop(0.0, '#b2ff74');
		gr.addColorStop(0.5, '#069f00');
		gr.addColorStop(0.7, '#069f00');
		gr.addColorStop(1.0, '#b2ff74');
		this._ctxCanvas.fillStyle = gr;
		this._ctxCanvas.beginPath();
		this._ctxCanvas.moveTo(xBar, yBar);
		this._ctxCanvas.lineTo(xBar + width, yBar);
		this._ctxCanvas.arc(xBar + width, yBar + (height / 2), height / 2, 3 * Math.PI / 2, Math.PI / 2, false);
		this._ctxCanvas.lineTo(xBar, yBar + height);
		this._ctxCanvas.arc(xBar, yBar + (height / 2), height / 2, 3 * Math.PI / 2, Math.PI / 2, true);
		this._ctxCanvas.closePath();
		this._ctxCanvas.fill();
	}
	drawPanelScope(points = 0,moves = 0,level=0) {
		let widthWindow = document.documentElement.clientWidth;
		let heightWindow = document.documentElement.clientHeight;
		let widthInTiles = this.objectRegister.ParametersOfGame.widthInTiles;
		let heightInTiles = this.objectRegister.ParametersOfGame.heightInTiles;
		let widthPanel;
		let heightPanel;
		let xPanel;
		let yPanel;
		if (widthInTiles == heightInTiles) {
			if (widthWindow > heightWindow) {
				heightPanel = widthPanel = (widthWindow * 0.5) - (heightWindow * 0.3) - 20;
				heightPanel = widthPanel = heightPanel > heightWindow * 0.6 ? heightWindow * 0.6 : heightPanel;
				xPanel = (widthWindow * 0.5) + (heightWindow * 0.3) + 10;
				yPanel = (heightWindow * 0.5) - (heightPanel * 0.5);

			} else {
				widthPanel = heightPanel = widthWindow * 0.2;
				xPanel = (widthWindow * 0.9) - (widthPanel * 0.5);
				yPanel = (heightWindow * 0.2) + (widthWindow * 0.3) - (heightPanel * 0.5);
			}
		} else if (widthInTiles > heightInTiles) {
			heightPanel = widthPanel = (widthWindow * 0.2) - 20;
			xPanel = (widthWindow * 0.9) - (widthPanel * 0.5);
			yPanel = (heightWindow * 0.2) + widthWindow * 0.6 * (heightInTiles / widthInTiles) * 0.5 - (heightPanel * 0.5);
		} else {
			heightPanel = widthPanel = (widthWindow - ((widthWindow * 0.5) + heightWindow * 0.6 * (widthInTiles / heightInTiles) * 0.5)) - 15;
			heightPanel = widthPanel = heightPanel > heightWindow * 0.6 ? heightWindow * 0.6 : heightPanel;
			xPanel = (widthWindow * 0.5) + heightWindow * 0.6 * (widthInTiles / heightInTiles) * 0.5 + 10;
			yPanel = (heightWindow * 0.5) - (heightPanel * 0.5);
        }
		let imagePanel = this._images.PanelScope[0];
		this._ctxCanvas.drawImage(imagePanel, xPanel, yPanel, widthPanel, heightPanel);
		//Draw text
		this._ctxCanvas.fillStyle = "white";
		this._ctxCanvas.textAlign = "center";
		//Draw points text
		let xPoints = xPanel + widthPanel * 0.5;
		let yPoints = yPanel + heightPanel * 0.86;
		let fontSizePoints = heightPanel * 0.1;
		this._ctxCanvas.font = fontSizePoints+"px Comic Sans MS";
		this._ctxCanvas.fillText(points, xPoints, yPoints);
		//Dravw moves text
		let xMoves = xPanel + widthPanel * 0.5;
		let yMoves = yPanel + heightPanel * 0.43;
		let fontSizeMoves = heightPanel * 0.2;
		this._ctxCanvas.font = fontSizeMoves + "px Comic Sans MS";
		this._ctxCanvas.fillText(moves, xMoves, yMoves);
		//Draew level text
		let xLevel = xPanel + widthPanel * 0.5;
		let yLevel = yPanel + heightPanel * 0.07;
		let fontSizeLevel = heightPanel * 0.095;
		this._ctxCanvas.font = fontSizeLevel + "px Comic Sans MS";
		this._ctxCanvas.fillStyle = "black";
		this._ctxCanvas.fillText("Уровень " + level, xLevel, yLevel);

	}
	drawWin() {
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.drawVin()");
				let widthWindow = document.documentElement.clientWidth;
				let heightWindow = document.documentElement.clientHeight;
				//Draw div
				let widthDiv = widthWindow * 0.6;
				let heightImage = widthDiv * 1.5; //This is all height image div + a image of win
				let heightDiv = widthDiv * 0.3;
				if (heightImage > heightWindow) {
					heightDiv = heightWindow * 0.3;
					widthDiv = heightDiv / 0.3;
				}
				let xDiv = widthWindow * 0.5 - widthDiv * 0.5;
				let yDiv = heightWindow * 0.5;
				if (widthWindow < heightWindow) {
					yDiv = widthWindow * 0.6;
				}
				let imgDiv = this._images.Field[0];
				this._ctxCanvas.drawImage(imgDiv, xDiv, yDiv, widthDiv, heightDiv);
				//Draw butoons
				let widthButtons = widthDiv * 0.28;
				let heightButtons = heightDiv * 0.4;
				let yButtons = yDiv + heightDiv * 0.5 - heightButtons * 0.5;
				let imgButtons = this._images.Button[1];
				let xRepeatButtons = xDiv + widthDiv * 0.5 - widthButtons * 0.5;
				let xMenuButtons = xRepeatButtons - widthButtons - widthDiv * 0.02;
				let xNextButtons = xRepeatButtons + widthButtons + widthDiv * 0.02;
				for (let item of this.objectRegister.Button) {
					if (item instanceof MenuButton) {
						this.drawButton(item, imgButtons, xMenuButtons, yButtons, widthButtons, heightButtons, "Меню");
					} else if (item instanceof RepeatButton) {
						this.drawButton(item, imgButtons, xRepeatButtons, yButtons, widthButtons, heightButtons, "Повтор");
					} else if (item instanceof NextButton) {
						this.drawButton(item, imgButtons, xNextButtons, yButtons, widthButtons, heightButtons, "Вперед");
					}
				}
				//Draw WIN
				let widthWinImage = widthDiv * 1.2;
				let heightWinImage = widthWinImage;
				let xWinImage = widthWindow * 0.5 - widthWinImage * 0.5;
				let yWinImage = yDiv - heightWinImage * 0.66;
				let imgWinImage = this._images.Win[0];
				this._ctxCanvas.drawImage(imgWinImage, xWinImage, yWinImage, widthWinImage, heightWinImage);
				resolve("Finish View.drawWin()");
			});
		});
		this._drawPromise = newPromise;
	}
	drawButton(object = null, img = null, x = 0, y = 0, width = 0, height = 0, text = "") {
		object.X = x;
		object.Y = y;
		object.width = width;
		object.height = height;
		object.img = img;
		this._ctxCanvas.drawImage(img, x, y, width, height);
		//Draw text
		let xT = x + width * 0.5;
		let yT = y + height * 0.5;
		let fontSizeT = height * 0.6;
		this._ctxCanvas.font = fontSizeT + "px Comic Sans MS";
		this._ctxCanvas.fillStyle = "white";
		this._ctxCanvas.textAlign = "center";
		this._ctxCanvas.textBaseline = "middle";
		this._ctxCanvas.fillText(text, xT, yT);


	}
	drawLose() {
		let newPromise = this._drawPromise.then((resolve) => {
			console.log(resolve);
			return new Promise((resolve, reject) => {
				console.log("Start View.drawLose()");
				let widthWindow = document.documentElement.clientWidth;
				let heightWindow = document.documentElement.clientHeight;
				//Draw div
				let widthDiv = widthWindow * 0.6;
				let heightImage = widthDiv * 1.5; //This is all height image div + a image of win
				let heightDiv = widthDiv * 0.3;
				if (heightImage > heightWindow) {
					heightDiv = heightWindow * 0.3;
					widthDiv = heightDiv / 0.3;
				}
				let xDiv = widthWindow * 0.5 - widthDiv * 0.5;
				let yDiv = heightWindow * 0.5;
				if (widthWindow < heightWindow) {
					yDiv = widthWindow * 0.6;
				}
				let imgDiv = this._images.Field[0];
				this._ctxCanvas.drawImage(imgDiv, xDiv, yDiv, widthDiv, heightDiv);
				//Draw butoons
				let widthButtons = widthDiv * 0.28;
				let heightButtons = heightDiv * 0.4;
				let yButtons = yDiv + heightDiv * 0.5 - heightButtons * 0.5;
				let imgButtons = this._images.Button[1];
				let xRepeatButtons = xDiv + widthDiv * 0.66 - widthButtons*0.5;
				let xMenuButtons = xDiv + widthDiv * 0.33 - widthButtons*0.5;
				for (let item of this.objectRegister.Button) {
					if (item instanceof MenuButton) {
						this.drawButton(item, imgButtons, xMenuButtons, yButtons, widthButtons, heightButtons, "Меню");
					} else if (item instanceof RepeatButton) {
						this.drawButton(item, imgButtons, xRepeatButtons, yButtons, widthButtons, heightButtons, "Повтор");
					}
				}
				//Draw Lose
				let widthLoseImage = widthDiv;
				let heightLoseImage = widthLoseImage * 0.3;
				let xLoseImage = xDiv;
				let yLoseImage = yDiv - heightLoseImage;
				let imgLoseImage = this._images.Lose[0];
				this._ctxCanvas.drawImage(imgLoseImage, xLoseImage, yLoseImage, widthLoseImage, heightLoseImage);
				resolve("Finish View.drawWin()");
			});
		});
		this._drawPromise = newPromise;
    }
	checkParameters() {
		console.log("Start View.checkParameters()");
		//This method checks if all drawn objects are in the general object registry.
		for (let key in this.objectRegister) {
			if (this.preState[key] == null) {
				if (this.objectRegister[key] != null) {
					console.log("Cath inconsistensy!");
					console.log({
						"View.preState": this.preState[key],
						"View.objectRegister": this.objectRegister[key]
					});
					continue;
				} else {
					continue;
				}
			}
			if (this.objectRegister[key] instanceof Array) {
				for (let i = 0; i < this.objectRegister[key].length; i++) {
					if (this.preState[key][i] == null) {
						if (this.objectRegister[key][i] != null) {
							console.log("Cath inconsistensy!");
							console.log({
								"View.preState": this.preState[key][i],
								"View.objectRegister": this.objectRegister[key][i],
							});
							continue;
						} else {
							continue;
						}
					}
					if (this.preState[key][i].proto != this.objectRegister[key][i]) {
						console.log("Cath inconsistensy!");
						console.log({
							"View.preState": this.preState[key],
							"View.objectRegister": this.objectRegister[key],
							"index": i,
							"View.preState[key][i]": this.preState[key][i],
							"View.objectRegister[key][i]": this.objectRegister[key][i]
						});
					}
                }

			} else if (this.objectRegister[key] instanceof Object) {
				for (let k in this.objectRegister[key]) {
					if (this.preState[key][k] == null) {
						if (this.objectRegister[key][k] != null) {
							console.log("Cath inconsistensy!");
							console.log({
								"View.preState": this.preState[key][i],
								"View.objectRegister": this.objectRegister[key][i],
							});
							continue;
						} else {
							continue;
						}
					}
					if (this.preState[key][k] != this.objectRegister[key][k]) {
						console.log("Cath inconsistensy!");
						console.log({
							"View.preState": this.preState[key],
							"View.objectRegister": this.objectRegister[key],
							"key": k,
							"View.preState[key][k]": this.preState[key][k],
							"View.objectRegister[key][k]": this.objectRegister[key][k]
						});
					}
                }

			} else {
				if (this.preState[key] != this.objectRegister[key]) {
					console.log("Cath inconsistensy!");
					console.log({
						"View.preState": this.preState,
						"View.objectRegister": this.objectRegister,
						"key": key,
						"View.preState[key]": this.preState[key],
						"View.objectRegister[key]": this.objectRegister[key]
					});
                }
            }
        }
    }
}