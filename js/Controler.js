class Controller {
    _game;
    constructor(game) {
        this._game = game;
    }
    begin(ctxCanvas) {
        document.addEventListener('click', (event) => {
            let mouseX = event.offsetX;
            let mouseY = event.offsetY;
            for (let key in this._game._objects) {
                for (let i = 0; i < this._game._objects[key].length; i++) {
                    let x = this._game._objects[key][i]._X;
                    let y = this._game._objects[key][i]._Y;
                    let width = this._game._objects[key][i]._width;
                    let height = this._game._objects[key][i]._height;
                    let path2D = new Path2D();
                    path2D.rect(x, y, width, height);
                    if (ctxCanvas.isPointInPath(path2D, mouseX, mouseY)) {
                        this.targetObjectForClick(this._game._objects[key][i]);
                    }
                }
            }
        });
    }
    targetObjectForClick(object) {
		//This function for check target object for available actions
        if (object instanceof Tile) {
            console.log(this.amountTilesWithSameColor(object));
        }
    }
	amountTilesWithSameColor(tile){
		//This function count amount tiles with same color located of the near
		//amountTilesWithSameColorRec use for recursive call
		//Next, call tile._field.linkTiles() for set isCounted to false
		let amount = this.amountTilesWithSameColorRec(tile);
		tile._field.linkTiles();
		return amount;
	}
    amountTilesWithSameColorRec(tile) {
		tile._isCounted = true;
        let idColor = tile._color;
        let amountTilesForBlast = 0;
        if (tile._leftTile != null&&tile._leftTile._isCounted==false) {
            if (idColor == tile._leftTile._color) {
                amountTilesForBlast++;
                amountTilesForBlast += this.amountTilesWithSameColorRec(tile._leftTile);
            }
        }
        if (tile._upTile != null&&tile._upTile._isCounted==false) {
            if (idColor == tile._upTile._color) {
                amountTilesForBlast++;
                amountTilesForBlast += this.amountTilesWithSameColorRec(tile._upTile);
            }
        }
        if (tile._rightTile != null&&tile._rightTile._isCounted==false) {
            if (idColor == tile._rightTile._color) {
                amountTilesForBlast++;
                amountTilesForBlast += this.amountTilesWithSameColorRec(tile._rightTile);
            }
        }
        if (tile._bottomTile != null&&tile._bottomTile._isCounted==false) {
            if (idColor == tile._bottomTile._color) {
                amountTilesForBlast++;
                amountTilesForBlast += this.amountTilesWithSameColorRec(tile._bottomTile);
            }
        }

        return amountTilesForBlast;
    }
}