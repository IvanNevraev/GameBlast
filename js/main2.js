document.addEventListener("DOMContentLoaded", main);
function main(){
	let mainCanvas = document.getElementById("mainCanvas");
	mainCanvas.width = document.documentElement.clientWidth;
	mainCanvas.height = document.documentElement.clientHeight;
	let canvas = mainCanvas.getContext('2d');
	let newGame = new Game(canvas);
	newGame.loadResourses();
	let newField = new Field(500, 500, 20, 20, 100, newGame);
	newField.drawMyself("img/Field.png", canvas);
	newField.fillTiles(5);
	


	console.log(newField);
	newGame._loadPromise.then(
		(result) => {
			console.log("All resorses downloaded. Amount: " + result);
			newField.drawTiles(canvas);
		},
		(error) => {

		});
}