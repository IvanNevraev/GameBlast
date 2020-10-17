function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min + Math.random()*(max + 1 - min);
  return Math.floor(rand);
}
