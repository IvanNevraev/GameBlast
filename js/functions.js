function randomInteger(min, max) {
	//This function generate random integer from min to max
	let rand = min + Math.random()*(max + 1 - min);
	return Math.floor(rand);
}
