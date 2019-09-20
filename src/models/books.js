const mongoose = require("mongoose"), // Este paquete es un ODM, para facilitar el modelado de los datos de la base de datos
	mongoosePaginate = require("mongoose-paginate-v2"), // Paquete usado para simplificar el proceso de paginacion y ordenamiento de los datos
	// Estructura de los libros
	bookSchema = new mongoose.Schema(
		{
			titulo: {
				type: String,
				required: true
			},
			descripcion: {
				type: String,
				required: true
			},
			fechaPublicacion: {
				type: Date,
				required: true,
				// Este garantiza que al momento de hacer una busqueda de datos, todos tengan la fecha de publicacion con el mismo formato
				get: date => {
					const publishedDate = new Date(date),
						dateFormatOptions = {
							year: "numeric",
							month: "2-digit",
							day: "2-digit"
						},
						formattedDate = publishedDate.toLocaleDateString(
							"en-GB",
							dateFormatOptions
						);

					return formattedDate;
				}
			},
			autor: {
				type: String,
				required: true
			},
			calificacion: {
				type: Number,
				required: true,
				default: 0
			}
		},
		{ toJSON: { getters: true }, id: false } // Este sirve para habilitar el metodo get de la propiedad "fechaPublicacion"
	);

// Se añade la funcionalidad del paquete al esquema
bookSchema.plugin(mongoosePaginate);

// Estos metodos estan presentes en todas las instancias del esquema "Books"
bookSchema.method({
	// Incrementa uno a la calificacion del libro
	incrementScore: async function() {
		try {
			this.calificacion++;
			await this.save();
		} catch (error) {
			throw error;
		}
	},
	// Decrementa uno a la calificacion del libro
	decrementScore: async function() {
		try {
			this.calificacion--;
			await this.save();
		} catch (error) {
			throw error;
		}
	}
});

module.exports = mongoose.model("Book", bookSchema);
