// Este paquete se usa para que los datos del archivo .env, se almacenen como variables de entorno
require("dotenv").config();

const http = require("http"),
	EventEmitter = require("events"),
	controllers = require("./controllers"),
	{ getPathName, matchDynamicRoutes } = require("./utils/urlUtils"),
	{ PORT = 3000 } = process.env;

class ResponseEmitter extends EventEmitter {}

const server = http.createServer(async (req, res) => {
	const { url: reqUrl, method } = req,
			pathName = getPathName(reqUrl), // La ruta sin los query params y sin un / al final
			resEmitter = new ResponseEmitter();

	// Se logea en la consola la ruta y el metodo, para en caso de un error facilitar el debugging
	console.log(`Request - Url: ${reqUrl}, Method: ${method}`);

	// Todas las rutas emiten este evento para mandar la respuesta de la peticion al cliente
	resEmitter.once("sendResponse", (dataToSend, statusCode) => {
		const jsonData = JSON.stringify(dataToSend);

		res.setHeader("Content-Type", "application/json");
		res.statusCode = statusCode;
		res.write(jsonData);
		res.end();
	});

	// En caso de cualquier error, se llama este evento para logearlo en la consola y formatear el mensaje de error con el que se va a responder
	resEmitter.once("error", (error, statusCode = 500) => {
		console.error(error);

		// El statusCode 500 es para errores internos del servidor, el consumidor no debe de conocer los detalles del mismo
		const errorMessage = statusCode !== 500 ? error.message : http.STATUS_CODES[500],
				errorData = {
					status: statusCode,
					message: errorMessage
				};

		// Se emite el evento para reponder con el error
		resEmitter.emit("sendResponse", errorData, statusCode);
	});

	// Dependiendo la ruta y el metodo se va a llamar el metodo controlador que le corresponde
	// Para las rutas con parametros dinamicos, lo que se verifica es que la ruta de la peticion tenga un esquema especifico
	if(pathName === "/api/v1/books" && method === "GET") controllers.getBooks(req, resEmitter);
	else if(pathName === "/api/v1/books" && method === "POST") controllers.publishBook(req, resEmitter);
	else if(matchDynamicRoutes("/api/v1/books/:id/increment-score", pathName) && method === "POST") controllers.incrementBookScore(req, resEmitter);
	else if(matchDynamicRoutes("/api/v1/books/:id/decrement-score", pathName) && method === "POST") controllers.decrementBookScore(req, resEmitter);
	else {
		//En caso de que no se tenga registrada la ruta solicitada, se va a mandar un error especificandolo
		const error = new Error("Not Found");
		return resEmitter.emit("error", error, 404);
	}
});

// Se inicializa el servidor para que este disponible en el puerto especificado
server.listen(PORT, () => {
	console.log("Server is up in", `http://localhost:${PORT}`);
});

module.exports = server;
