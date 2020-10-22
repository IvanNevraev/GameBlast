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
