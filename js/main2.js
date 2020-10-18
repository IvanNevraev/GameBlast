document.addEventListener("DOMContentLoaded", main);
function main() {
	//Set canvas for all window and receive its description and context
	let mainCanvas = document.getElementById("mainCanvas");
	mainCanvas.width = document.documentElement.clientWidth;
	mainCanvas.height = document.documentElement.clientHeight;
	let ctxCanvas = mainCanvas.getContext('2d');
	//Make arrays with all necessary resources for game
	let amountResources = 6;
	let puthToResources = "img/";
	let imgTiles = ["BlueTile.png", "RedTile.png", "GreenTile.png", "PurpleTile.png", "YellowTile.png"];
	let imgField = ["Field.png"];
	//Make object with maked arrays
	let resources = {
		"amountResources": amountResources,
		"puthToResources": puthToResources,
		"imgTile": imgTiles,
		"imgField": imgField
	};
	//Make new object of Game
	let game = new Game();
	game.loadResourses(resources);
	game._loadPromise.then(
		(result) => {
			console.log("All resorses downloaded. Amount: " + result);
			let field = new Field(500, 500, 20, 20, 50, game._resources.imgField[0], game);
			field.craeteTiles(2);
			let render = new Rendering();
			let objectsForDraw = new Array();
			objectsForDraw.push(field);
			objectsForDraw = objectsForDraw.concat(field._arrayTilesForDraw);
			render.drawAll(objectsForDraw, ctxCanvas,10);
			console.log(game);
			console.log(field);
		},
		(error) => {

		});
	/*const canvas1 = document.getElementById('mainCanvas');
	const ctx = canvas1.getContext('2d');

	// Create circle
	const circle = new Path2D();
	circle.arc(150, 75, 50, 0, 2 * Math.PI);
	ctx.fillStyle = 'red';
	ctx.fill(circle);
	let i = new Image();
	i.src = "img/BlueTile.png";
	i.onload = () => {
		ctx.drawImage(i, 100, 100, 100, 100);
	}
	let img = new Path2D();
	img.rect(100, 100, 100, 100);
	

	// Listen for mouse moves
	canvas1.addEventListener('mousemove', function (event) {
		// Check whether point is inside circle
		console.log(ctx.isPointInPath(img,event.offsetX, event.offsetY));
		if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
			ctx.fillStyle = 'green';
		}
		else {
			ctx.fillStyle = 'red';
		}

		// Draw circle
		//ctx.clearRect(0, 0, canvas1.width, canvas1.height);
		//ctx.fill(circle);

		onlistener(elemDom) {
		elemDom.addEventListener('mousemove', (event) => {
			//console.log(event.offsetX + " " + event.offsetY);
		});
		}
	});*/
}