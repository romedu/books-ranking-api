const mongoose = require("mongoose"), // Este paquete es un ODM, para facilitar el modelado de los datos de la base de datos
	{ DB_URL } = process.env; // Por motivos de seguridad, esta es brindada por el entorno

// Logea en la consola informacion referente a cualquier peticion a la base datos
mongoose.set("debug", true);
// Desabilita una funcion actualmente deprecada
mongoose.set("useFindAndModify", false);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
// Permite realizar consultas sin la necesidad de callbacks
mongoose.Promise = Promise;

// Modelo de libros
exports.Book = require("./books");

module.exports = exports;
