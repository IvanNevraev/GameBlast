document.addEventListener("DOMContentLoaded", main);
function main(){
	let mainCanvas = document.getElementById("mainCanvas");
	mainCanvas.width = document.documentElement.clientWidth;
	mainCanvas.height = document.documentElement.clientHeight;
	let ctxCanvas = mainCanvas.getContext('2d');
	let newGame = new Game(ctxCanvas);
	let render = new Rendering();
	newGame.onlistener(mainCanvas);
	newGame.loadResourses();
	let newField = new Field(500, 500, 20, 20, 50, newGame);
	render.drawField(newField,"img/Field.png", ctxCanvas);
	newField.fillTiles(2);
	newGame._loadPromise.then(
		(result) => {
			console.log("All resorses downloaded. Amount: " + result);
			render.drawTiles(newField,newGame._imgTiles,ctxCanvas);
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
	});*/
}