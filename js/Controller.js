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
                "clickOnTile": object
            });
        } else if (object instanceof PauseButton) {
            this._game.facade({
                "clickOnPauseButton": object
            });
        } else if (object instanceof MenuButton) {
            this._game.facade({
                "clickOnMenuButton": object
            });
        } else if (object instanceof RepeatButton) {
            this._game.facade({
                "ckickOnRepeatButton": object
            });
        } else if (object instanceof NextButton) {
            this._game.facade({
                "clickOnNextButton": object
            });
        }
    }
}