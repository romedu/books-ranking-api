const { checkIfValidString, checkIfValidDate } = require("./utils/validationUtils");

// Valida los datos para la publicacion de un libro
// Retorna un array de tamaño 2, [Boolean - diciendo si es todos los datos son validos, Array - especificando los campos que no pasaron la prueba]
exports.bookValidator = newBookData => {
	let isValid = true;

	const invalidProperties = [],
		// Propiedades a evaluar junto con el metodo usado para dicha evaluacion
		validatorSchema = {
			titulo: checkIfValidString,
			descripcion: checkIfValidString,
			fechaPublicacion: checkIfValidDate,
			autor: checkIfValidString
		};

	// Verifica que cada una de las propiedas del libro cumplan con las evaluaciones establecidas en el esquema
	// Las propiedades que esten demas son ignoradas
	for (let [key, validator] of Object.entries(validatorSchema)) {
		const propToValidate = newBookData[key],
			validationResult = validator(propToValidate);

		if (!validationResult) {
			isValid = false;
			invalidProperties.push(key);
		}
	}

	return [isValid, invalidProperties];
};

module.exports = exports;
