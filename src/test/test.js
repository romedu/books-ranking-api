const chai = require("chai"),
	chaiHttp = require("chai-http"),
	server = require("../index");

chai.should();
chai.use(chaiHttp);

describe("Prueba del api", function() {
	it("Deberia de retornar un status de 404", done => {
		chai
			.request(server)
			.get("/api/v1/books/d")
			.end((error, result) => {
				result.should.have.status(404);
				done();
			});
	});

	it("Deberia buscar los primeros 10 resultados de libros", done => {
		chai
			.request(server)
			.get("/api/v1/books")
			.end((error, result) => {
				result.should.have.status(200);
				done();
			});
	});

	it("Deberia de publicar un libro", done => {
		const bookData = {
			titulo: "Hola prueba",
			descripcion: "una prueba exitosa",
			fechaPublicacion:
				"Tue Sep 05 2001 21:59:32 GMT-0400 (Atlantic Standard Time)",
			autor: "Tester",
			calificacion: 0
		};

		chai
			.request(server)
			.post("/api/v1/books")
			.send(bookData)
			.end((error, res) => {
				res.should.have.status(201);
				done();
			});
	});

	it("Deberia incrementar la calificacion de un libro", done => {
		chai
			.request(server)
			.post("/api/v1/books/5d8440a695dc6e223c22a41d/increment-score")
			.end((error, result) => {
				result.should.have.status(200);
				done();
			});
	});

	it("Deberia disminuir la calificacion de un libro", done => {
		chai
			.request(server)
			.post("/api/v1/books/5d8440a695dc6e223c22a41d/decrement-score")
			.end((error, result) => {
				result.should.have.status(200);
				done();
			});
	});
});
