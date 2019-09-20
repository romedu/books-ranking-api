const url = require("url"),
	querystring = require("querystring");

// Recibe una ruta como parametro,y la retorna sin los query params y sin un / al final
exports.getPathName = reqUrl => {
	const { pathname: urlPathName } = url.parse(reqUrl),
		parsedPathName = urlPathName.endsWith("/")
			? urlPathName.slice(0, urlPathName.length - 1)
			: urlPathName;

	return parsedPathName;
};

// Recibe una ruta como parametro,y retorna los query params en un objeto {[nombre]: [valor]}
exports.getQueryParams = reqUrl => {
	const queryParamString = reqUrl.split("?")[1],
		queryParams = querystring.parse(queryParamString);

	return queryParams;
};

// Recibe una ruta como parametro y retorna un array todas las partes que component dicha ruta, digase todo lo que esta entre /
// Ej: "/hello/hey" = ["hello", "hey"]
exports.getRouteProps = route =>
	route.split("/").filter(property => property !== "");

// Recibe una estructura a seguir y una ruta, y verifica que la ultima siga el esquema de la primera
// Este se usa para comparar rutas dinamicas
// Ej: "/hello/:id" === "hello/74683"
exports.matchDynamicRoutes = (routeSchema, routeToCompare) => {
	const schemaProperties = exports.getRouteProps(routeSchema),
		routeProperties = exports.getRouteProps(routeToCompare);

	if (schemaProperties.length !== routeProperties.length) return false;

	for (let i = 0; i < schemaProperties.length; i++) {
		const propertyComparing = schemaProperties[i];

		if (propertyComparing.includes(":")) continue;
		if (propertyComparing !== routeProperties[i]) return false;
	}

	return true;
};

// Recibe una estructura a seguir y una ruta, y retorna un object con los parametros dinamicos
// Ej: "/hello/:id" - "/hello/873" = {id: "873"}
exports.extractDynamicProps = (routeSchema, routeToExtractFrom) => {
	const dynamicProps = {},
		doesRoutesMatches = exports.matchDynamicRoutes(
			routeSchema,
			routeToExtractFrom
		);

	if (doesRoutesMatches) {
		const schemaProperties = exports.getRouteProps(routeSchema),
			routeProperties = exports.getRouteProps(routeToExtractFrom);

		schemaProperties.forEach((property, index) => {
			if (property.includes(":")) {
				const propName = property.slice(1),
					propValue = routeProperties[index];

				// Si existen varias propiedades con el mismo nombre, se retornara el valor de la ultima
				dynamicProps[propName] = propValue;
			}
		});
	}

	console.log(routeSchema, routeToExtractFrom);
	return dynamicProps;
};

module.exports = exports;
