function randomInteger(min, max) {
	//This function generate random integer from min to max
	let rand = min + Math.random()*(max + 1 - min);
	return Math.floor(rand);
}
function matrixToLineArray(matrix, array) {
	let j = 0;
	for (let i = 0; i < matrix.length; i++) {
		for (let k = 0; k < matrix[i].length; k++) {
			array[j] = matrix[i][k];
			j++;
        }
    }
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
