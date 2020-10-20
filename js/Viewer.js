class Viewer{
	
}
class Rendering {
	drawImg(object, ctxCanvas) {
		ctxCanvas.drawImage(object._img, object._X, object._Y, object._width, object._height);
	}
	drawAll(arrayObjects, ctxCanvas, delay = 0) {
		for (let i = 0; i < arrayObjects.length; i++) {
			setTimeout(() => {
				ctxCanvas.drawImage(arrayObjects[i]._img, arrayObjects[i]._X, arrayObjects[i]._Y, arrayObjects[i]._width, arrayObjects[i]._height);
			}, delay*i);
        }
	}
}