# Backend Test

Este es un simple api escrito en Node.js, usando MongoDB como base de datos. En el se pueden ver y publicar libros, y además calificarlos como buenos o malos.

### Instalación y configuración

1. Instalar [Node.js][node.js].
2. En una terminal, entrar a la ruta del proyecto y correr el comando `npm install`, para instalar todas las dependencias.
3. Dentro de la ruta del proyecto correr el comando `npm start`, para inicializar el servidor.
4. Para correr las pruebas se debe correr el comando `npm test`, dentro de la ruta del proyecto.

##### Notas:
-  Para correr las pruebas es necesario que el servidor no este inicializado.

### Documentación

##### Rutas

Las rutas son las siguientes:

| Ruta                              | Método | Descripción                                       | Formato Respuesta                                                        |
| --------------------------------- | ------ | ------------------------------------------------- | ------------------------------------------------------------------------ |
| /api/v1/books                     | GET    | Busca un listado de libros, ordenados por novedad | { "data": [{}], "totalDocs": 1, "limit": 1, "page": 1, "totalPages": 1 } |
| /api/v1/books                     | POST   | Publica un libro                                  | { "id": "123", "message": "msg" }                                        |
| /api/v1/books/:id/increment-score | POST   | Incrementa en **1** la calificación del libro     | { "message": "msg" }                                                     |
| /api/v1/books/:id/decrement-score | POST   | Disminuye en **-1** la calificación del libro     | { "message": "msg" }                                                     |

##### Sobre las rutas

A continuación se detallan informaciones adicionales asociadas a cada ruta:

**Busqueda de libros:**

-  Los libros son ordenados de más reciente a más antiguo.
-  La ruta acepta dos parámetros en el query: page y limit.
-  Cualquier párametro adicional es ignorado.
-  En el parámetro page se define la página de resultados a mostrar, por defecto esta en 1.
-  En el parámetro limit se definen la cantidad de libros a mostrar por página, por defecto esta en 10.
-  Los parámetros en el query se pueden agregar de la siguiente forma: /api/v1/books?page=1&limit=5.

**Publicación de libros:**

-  Para la publicación no es necesario estar autenticado.
-  Es necesario pasar los siguiente 4 campos en el cuerpo de la petición: titulo, descripcion, fechaPublicacion, autor.
-  Es requerido para los campos titulo, descripcion, autor: que este sea de tipo string y que su tenga al menos un carácter.
-  Es requerido para el campo fechaPublicacion: que sea un string representando una fecha en un formato valido en javascript y no mayor a la hora actual, ej. "05.05.18". [Más información][w3s].
-  Cualquier campo adicional será ignorado.

**Calificación de libros:**

-  Las rutas para calificar libros son las siguientes: /api/v1/books/:id/increment-score y /api/v1/books/:id/decrement-score. Estas son para aumentarla o disminuirla respectivamente.
-  Para la calificación no es necesario estar autenticado.
-  En el parámetro :id, se define el id del libro a calificar, ej. /api/v1/books/5d90f50b4j76ef40dcd6bdc8/increment-score.
-  Las calificaciones pueden ser tanto positivas, como negativas.

**Errores:**

-  Cuando ocurre un error con la petición se retorna el estatus y el mensaje del error, ej. { "status":404,"message":"Not Found" }.
-  Cuando ocurre un error interno, se retorna un mensaje generico con el estatus 500.

### Licencia

MIT

[//]: # "Referencia a las rutas del documento"
[w3s]: https://www.w3schools.com/js/js_date_formats.asp
[node.js]: https://nodejs.org
