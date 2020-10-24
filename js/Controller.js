class Controller {
    _game;
	_ctxCanvas;
    objectRegister = {};
    constructor(game, objectRegister, ctxCanvas) {
        this._game = game;
        this.objectRegister = objectRegister;
		this._ctxCanvas = ctxCanvas;
		console.log(this);
    }
    begin() {
        document.addEventListener('click', (event) => {
            let mouseX = event.offsetX;
            let mouseY = event.offsetY;
            if (this.objectRegister.isControled == false) {
                console.log("Controller cannot controle!");
                return;
            }
            for (let key in this.objectRegister) {
                for (let i = 0; i < this.objectRegister[key].length; i++) {
					if(this.objectRegister[key][i]==null){
						continue;
					}
                    let x = this.objectRegister[key][i].X;
                    let y = this.objectRegister[key][i].Y;
                    let width = this.objectRegister[key][i].width;
                    let height = this.objectRegister[key][i].height;
                    let path2D = new Path2D();
                    path2D.rect(x, y, width, height);
                    if (this._ctxCanvas.isPointInPath(path2D, mouseX, mouseY)) {
                        this.targetObjectForClick(this.objectRegister[key][i]);
                    }
                }
            }
        });
    }
    targetObjectForClick(object) {
        console.log("Start Controller.targetObjectForClick()");
		//This function for check target object for available actions
        if (object instanceof Tile) {
            //Call the facade of the Game class
            this._game.facade({
                "clickOnTile": this.getArrayTilesWithSameColor(object)
            });
        } else if (object instanceof PauseButton) {
            this._game.facade({
                "clickOnPauseButton": object
            });
        }
    }
    getArrayTilesWithSameColor(tile) {
        console.log("Start Controler.getArrayTilesWithSameColor()");
		/*
		The recursive method is based on the "raised hand" principle.
		When a method is called for a neighboring tile of similar color,
		it puts itself in the array and "lowers its hand".
		*/
		let arrayTiles = new Array();
		this.getArrayTilesWithSameColorRec(tile,arrayTiles);
		tile._field.linkTiles();
		return arrayTiles;
	}
    getArrayTilesWithSameColorRec(tile,arrayTiles) {
		tile.isCounted = true;
		arrayTiles.push(tile);
        let idColor = tile._color;
        if (tile.leftTile != null&&tile.leftTile.isCounted==false) {
            if (idColor == tile.leftTile._color) {
                this.getArrayTilesWithSameColorRec(tile.leftTile,arrayTiles);
            }
        }
        if (tile.upTile != null&&tile.upTile.isCounted==false) {
            if (idColor == tile.upTile._color) {
                this.getArrayTilesWithSameColorRec(tile.upTile,arrayTiles);
            }
        }
        if (tile.rightTile != null&&tile.rightTile.isCounted==false) {
            if (idColor == tile.rightTile._color) {
                this.getArrayTilesWithSameColorRec(tile.rightTile,arrayTiles);
            }
        }
        if (tile.bottomTile != null&&tile.bottomTile.isCounted==false) {
            if (idColor == tile.bottomTile._color) {
                this.getArrayTilesWithSameColorRec(tile.bottomTile,arrayTiles);
            }
        }

        return arrayTiles;
    }
}