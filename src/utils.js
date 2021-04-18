const constants = require('./constants');

/**
 * Validates query parameters for routes by ensureing specified variables are defined
 * @param object Array of values that must be defined
 * @param response Response to send an error message to the sender
 * @return True if at least one value is are undefined, false if all are defined
 */
const containsUndefinedValues = function (object, response) {
	let values = []; // Undefined values
	for (value in object) if (!object[value]) values.push(value);
	if (values.length == 0) return false;

	let parameters = values.join(values.length == 2 ? ' and ' : ', '),
		s = values.length > 1 ? 's' : '';

	response.status(422).send({
		error: 'Missing query parameters.',
		message: `You must specify the ${parameters} query parameter${s}!`,
	});
	return true;
};

/**
 * Validates the increment query parameter is within appropriate bounds
 * @param increment Increment distance
 * @param response Response to send an error message to the sender
 * @return True if the increment is too large or too small, false if increment is valid
 */
const containsInvalidIncrement = function (increment, response) {
	let min = constants.MIN_INCREMENT_DISTANCE,
		max = constants.MAX_INCREMENT_DISTANCE;
	if (isNaN(increment) || increment < min || increment > max) {
		response.status(422).send({
			error: `Invalid increment size (${increment} meters).`,
			message: `Your increment parameter must be a value between ${min} and ${max}!`,
		});
		return true;
	} else return false;
};

/**
 * @param key API key required for API services
 * @param response Response to send an error message to the sender
 * @return True if the key is invalid or undefined, false if the key is valid
 */
const containsInvalidKey = function (key, response) {
	if (key && key == process.env.RESEARCH_API_KEY) return false;
	let error;
	if (!key) error = 'An API key is required to perform this function.';
	else error = 'The specified API key is invalid.';
	response.status(422).send({ error });
	return true;
};

/**
 * @param {String} String1
 * @param {String} String2
 * @returns True only if given strings are equal regardless of casing
 */
const equalsIgnoreCase = function (string1, string2) {
	return string1 && string2 && string1.toUpperCase() === string2.toUpperCase() ? true : false;
};

module.exports = {
	containsUndefinedValues,
	containsInvalidIncrement,
	containsInvalidKey,
	equalsIgnoreCase,
};
