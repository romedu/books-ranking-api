// Recibe un string en kebab case como parametro y retorna este en camel case
// Ej: camel-case = camelCase
exports.fromKebabToCamelCase = phrase => phrase.split("-").map((word, index) => (index ? exports.capitalizeString(word) : word)).join("");

// Recibe un string en camel case como parametro y retorna este en kebab case
// Ej: camelCase = camel-case
exports.fromCamelToKebabCase = stringToConvert => stringToConvert.split("").map(char => char !== char.toLowerCase() ? `-${char.toLowerCase()}` : char).join("");

// Recibe un string y retorna este con su primer caracter en mayuscula
// Ej: camelCase = CamelCase
exports.capitalizeString = word => word.split("").map((letter, index) => (index ? letter : letter.toUpperCase())).join("");