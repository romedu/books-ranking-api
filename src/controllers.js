const { Book } = require("./models"),
	{ bookValidator } = require("./validators"),
	{ fromCamelToKebabCase } = require("./utils/stringUtils"),
	{ getQueryParams, extractDynamicProps } = require("./utils/urlUtils");

// Busca en la base datos, una lista de los libros organizados por la fecha de su publicacion
// Estos viene separados por paginas, basados en los query params, por defecto de 10 en 10
exports.getBooks = async (req, resEmitter) => {
	try {
		const queryParams = getQueryParams(req.url),
			// Configura los campos a retornar de la paginacion
			customLabels = {
				docs: "data",
				nextPage: false,
				prevPage: false,
				hasPrevPage: false,
				hasNextPage: false,
				pagingCounter: false
			},
			// Por defecto se buscan los primeros 10 valores
			paginationOptions = {
				customLabels,
				page: queryParams.page || 1,
				limit: queryParams.limit || 10,
				sort: { fechaPublicacion: "descending" }
			},
			books = await Book.paginate({}, paginationOptions);

		return resEmitter.emit("sendResponse", books, 200);
	} catch (error) {
		return resEmitter.emit("error", error);
	}
};

// Con los datos pasados en el request body, si estos son validos, se publica un libro
exports.publishBook = async (req, resEmitter) => {
	// Como los datos vienen en forma de stream, se van juntando los buffers segun vayan llegando
	const bodyChunks = [];

	// Llega un chunk del body y se agrega al resto de los chunks
	req.on("data", chunk => bodyChunks.push(chunk));

	// Cuando ya llegan los datos totalmente se procede con la publicacion
	req.on("end", async () => {
		try {
			const reqBody = JSON.parse(Buffer.concat(bodyChunks).toString()), // Se formatean los datos para que puedan ser usables
				{ calificacion, ...newBookData } = reqBody, // La calificacion viene por defecto en 0, no puede ser alterada directamente
				[isDataValid, invalidProperties] = bookValidator(newBookData);

			// Si hubo un fallo con la validacion, se manda un error con el nombre de la(s) propiedades invalidas
			if (!isDataValid) {
				const invalidFields = invalidProperties.join(", "),
					errorMessage = `Invalid fields: ${invalidFields}`,
					error = new Error(errorMessage);

				return resEmitter.emit("error", error, 400);
			} else {
				// Para la respuesta se incluye el id del nuevo libro y un mensaje
				const publishedBook = await Book.create(newBookData),
					responseMessage = {
						id: publishedBook._id,
						message: "Book published successfully"
					};

				return resEmitter.emit("sendResponse", responseMessage, 201);
			}
		} catch (error) {
			return resEmitter.emit("error", error);
		}
	});
};

// Este recibe el nombre de uno de los metodos de los libros, y retorna una funcion en la que este se llama
const callBookMethod = methodName => {
	return async (req, resEmitter) => {
		try {
			const kebabedMethodName = fromCamelToKebabCase(methodName),
				{ id: bookId } = extractDynamicProps(
					`/api/v1/books/:id/${kebabedMethodName}`,
					req.url
				), // Se extrae el id de los parametros dinamicos
				bookToUpdate = await Book.findById(bookId),
				methodToCall = bookToUpdate && bookToUpdate[methodName]; // la funcion del libro a llamar, en caso de este ser encontrado

			// Si el libro no se encuentro mandar un error
			if (!bookToUpdate) {
				const error = new Error("Book Not Found");
				return resEmitter.emit("error", error, 404);
			}
			// Si la funcion no se encuentro mandar un error
			else if (typeof methodToCall !== "function")
				throw new Error("Invalid book method called");
			else {
				// Hay que llamarlo pasandole el valor de "this", porque con la reasignacion de la funcion se perdio el contexto
				await methodToCall.call(bookToUpdate);
				const message = "Book score updated successfully";
				return resEmitter.emit("sendResponse", { message }, 200);
			}
		} catch (error) {
			return resEmitter.emit("error", error);
		}
	};
};

// Incrementa uno a la calificacion del libro
exports.incrementBookScore = callBookMethod("incrementScore");

// Decrementa uno a la calificacion del libro
exports.decrementBookScore = callBookMethod("decrementScore");

module.exports = exports;
