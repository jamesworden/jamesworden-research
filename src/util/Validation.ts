import { Response } from 'express';
import constants from '../config/Constants';

/**
 * Validates query parameters for routes by ensureing specified variables are defined
 * @param object Array of values that must be defined
 * @param response Response to send an error message to the sender
 * @return True if at least one value is are undefined, false if all are defined
 */
let containsUndefinedValues = (object: any, response: Response): boolean => {
	let values: String[] = []; // Undefined values
	for (let value in object) if (!object[value]) values.push(value);
	if (values.length == 0) return false;
	let parameters: string = values.join(values.length == 2 ? ' and ' : ', '),
		s = values.length > 1 ? 's' : '';
	response
		.status(422)
		.send(
			new ErrorMessage(
				'Missing query parameters.',
				`You must specify the ${parameters} query parameter${s}!`
			)
		);
	return true;
};

/**
 * Validates the increment query parameter is within appropriate bounds
 * @param increment Increment distance
 * @param response Response to send an error message to the sender
 * @return True if the increment is too large or too small, false if increment is valid
 */
let containsInvalidIncrement = (increment: number, response: Response): boolean => {
	let min = constants.MIN_INCREMENT_DISTANCE,
		max = constants.MAX_INCREMENT_DISTANCE;
	if (isNaN(increment) || increment < min || increment > max) {
		response
			.status(422)
			.send(
				new ErrorMessage(
					`Invalid increment size (${increment} meters).`,
					`Your increment parameter must be a value between ${min} and ${max}!`
				)
			);
		return true;
	} else return false;
};

/**
 * @param {String} waypoints A string of waypoints separated by '|'
 * @returns If there are too many waypoints return true, otherwise return false
 * If waypoints is undefined, it will return false as this function only cares
 * if there are too many waypoints.
 */
let containsExtraWaypoints = (waypoints: String, response: Response): boolean => {
	if (!waypoints) return false;
	var array = waypoints.split('|');
	if (array.length > constants.MAXIMUM_WAYPOINTS_PER_ROUTE) {
		response
			.status(422)
			.send(
				new ErrorMessage(
					`Too many waypoints in this route (${array.length} waypoints).`,
					'Maximum waypoints: ' + constants.MAXIMUM_WAYPOINTS_PER_ROUTE + '\n' + array
				)
			);
	}
	return false;
};

/**
 * @param key API key required for API services
 * @param response Response to send an error message to the sender
 * @return True if the key is invalid or undefined, false if the key is valid
 */
let containsInvalidKey = (key: string, response: Response): boolean => {
	if (key && key == process.env.RESEARCH_API_KEY) return false;
	let message: string;
	if (!key) message = 'An API key is required to perform this function.';
	else message = 'The specified API key is invalid.';
	response.status(422).send(new ErrorMessage('API Key Required', message));
	return true;
};

/**
 * @param {String} String1
 * @param {String} String2
 * @returns True only if given strings are equal regardless of casing
 */
let equalsIgnoreCase = (string1: string, string2: string): boolean =>
	string1 && string2 && string1.toUpperCase() === string2.toUpperCase() ? true : false;

/**
 * @param {String} String
 * @returns True only if given strings are equal regardless of casing
 */
let equalsTrue = (string: string): boolean => equalsIgnoreCase(string, 'true');

export {
	containsUndefinedValues,
	containsInvalidIncrement,
	containsExtraWaypoints,
	containsInvalidKey,
	equalsIgnoreCase,
	equalsTrue,
};

/**
 * Used for returning errors in query validation only.
 */
class ErrorMessage {
	error: string;
	message: string;

	constructor(error: string, message: string) {
		this.error = error;
		this.message = message;
	}
}
