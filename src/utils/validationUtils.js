// Recibe un parametro, se valida que este sea de tipo string y tenga un length de al menos 1 excluyendo espacios vacios
// Retorna un Boolean
exports.checkIfValidString = stringToCheck => {
	if(typeof stringToCheck !== "string") return false;
	return !!stringToCheck.trim();
}

// Recibe un parametro, se valida que este tenga un formato valido en javascript
// Retorna un Boolean
exports.checkIfValidDate = dateToCheck => {
	const dateValue = new Date(dateToCheck).valueOf(),
			currentDateValue = new Date().valueOf();

	return !isNaN(dateValue) && (currentDateValue > dateValue);
}