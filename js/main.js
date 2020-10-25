document.addEventListener("DOMContentLoaded", main);
function main() {
	let mainCanvas = document.getElementById("mainCanvas");
	mainCanvas.width = document.documentElement.clientWidth;
	mainCanvas.height = document.documentElement.clientHeight;
	let ctxCanvas = mainCanvas.getContext('2d');
	//This is object with names of images
	//Name of class : name of image
	let nameOfImages = {
		"amountOfFiles" : 12,
		"puthToFiles" : "img/",
		"Field" : ["Field.png"],
		"Tile": ["BlueTile.png", "GreenTile.png", "PurpleTile.png", "RedTile.png", "YellowTile.png"],
		"Button" : ["PauseButton.png","Button1.png"],
		"Background" : ["Background.jpg"],
		"Progress" : ["BackgroundProgress.png"],
		"PanelScope": ["PanelScope.png"],
		"Win" : ["Win.png"]
	};
	//This register will use all our classes
	//It containes all game objects
	let objectRegister = {};
	let view = new View(objectRegister, ctxCanvas, nameOfImages);
	let game = new Game(view, objectRegister);
	let controler = new Controller(game, objectRegister,ctxCanvas);
	game.buildeGame();
	controler.begin();
}