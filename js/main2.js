document.addEventListener("DOMContentLoaded", main);
function main(){
	let mainCanvas = document.getElementById("mainCanvas");
	mainCanvas.width = document.documentElement.clientWidth;
	mainCanvas.height = document.documentElement.clientHeight;
	let ctx = mainCanvas.getContext('2d');
	let field1 = new Field(15,10,10,20);
	field1.drawMyself(ctx);
	field1.fillTiles(3);
	field1.drawTiles(ctx);
	console.log(field1);
}