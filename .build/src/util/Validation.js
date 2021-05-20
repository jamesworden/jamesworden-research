"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equalsIgnoreCase = exports.containsInvalidKey = exports.containsExtraWaypoints = exports.containsInvalidIncrement = exports.containsUndefinedValues = void 0;
var ErrorMessage_1 = require("../model/ErrorMessage");
var Constants_1 = require("../config/Constants");
/**
 * Validates query parameters for routes by ensureing specified variables are defined
 * @param object Array of values that must be defined
 * @param response Response to send an error message to the sender
 * @return True if at least one value is are undefined, false if all are defined
 */
var containsUndefinedValues = function (object, response) {
    var values = []; // Undefined values
    for (var value in object)
        if (!object[value])
            values.push(value);
    if (values.length == 0)
        return false;
    var parameters = values.join(values.length == 2 ? ' and ' : ', '), s = values.length > 1 ? 's' : '';
    response
        .status(422)
        .send(new ErrorMessage_1.default('Missing query parameters.', "You must specify the " + parameters + " query parameter" + s + "!"));
    return true;
};
exports.containsUndefinedValues = containsUndefinedValues;
/**
 * Validates the increment query parameter is within appropriate bounds
 * @param increment Increment distance
 * @param response Response to send an error message to the sender
 * @return True if the increment is too large or too small, false if increment is valid
 */
var containsInvalidIncrement = function (increment, response) {
    var min = Constants_1.default.MIN_INCREMENT_DISTANCE, max = Constants_1.default.MAX_INCREMENT_DISTANCE;
    if (isNaN(increment) || increment < min || increment > max) {
        response
            .status(422)
            .send(new ErrorMessage_1.default("Invalid increment size (" + increment + " meters).", "Your increment parameter must be a value between " + min + " and " + max + "!"));
        return true;
    }
    else
        return false;
};
exports.containsInvalidIncrement = containsInvalidIncrement;
/**
 * @param {String} waypoints A string of waypoints separated by '|'
 * @returns If there are too many waypoints return true, otherwise return false
 * If waypoints is undefined, it will return false as this function only cares
 * if there are too many waypoints.
 */
var containsExtraWaypoints = function (waypoints, response) {
    if (!waypoints)
        return false;
    var array = waypoints.split('|');
    if (array.length > Constants_1.default.MAXIMUM_WAYPOINTS_PER_ROUTE) {
        response
            .status(422)
            .send(new ErrorMessage_1.default("Too many waypoints in this route (" + array.length + " waypoints).", 'Maximum waypoints: ' + Constants_1.default.MAXIMUM_WAYPOINTS_PER_ROUTE + '\n' + array));
    }
    return false;
};
exports.containsExtraWaypoints = containsExtraWaypoints;
/**
 * @param key API key required for API services
 * @param response Response to send an error message to the sender
 * @return True if the key is invalid or undefined, false if the key is valid
 */
var containsInvalidKey = function (key, response) {
    if (key && key == process.env.RESEARCH_API_KEY)
        return false;
    var message;
    if (!key)
        message = 'An API key is required to perform this function.';
    else
        message = 'The specified API key is invalid.';
    response.status(422).send(new ErrorMessage_1.default('API Key Required', message));
    return true;
};
exports.containsInvalidKey = containsInvalidKey;
/**
 * @param {String} String1
 * @param {String} String2
 * @returns True only if given strings are equal regardless of casing
 */
var equalsIgnoreCase = function (string1, string2) {
    return string1 && string2 && string1.toUpperCase() === string2.toUpperCase() ? true : false;
};
exports.equalsIgnoreCase = equalsIgnoreCase;
//# sourceMappingURL=Validation.js.map