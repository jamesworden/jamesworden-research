const express = require('express');
const constants = require('../constants');
const utils = require('../utils');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Define query parameters
	const key = req.query.key,
		origin = req.query.origin,
		destination = req.query.destination,
		waypoints = req.query.waypoints,
		increment = req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;

	// Validate query parameters
	if (utils.containsInvalidKey(key, res)) return;
	if (utils.containsInvalidIncrement(increment, res)) return;
	if (utils.containsUndefinedValues({ origin, destination, waypoints }, res)) return;

	// Ensure number of waypoints is valid
	let array = waypoints.split('|');
	if (array.length > constants.MAXIMUM_WAYPOINTS_PER_ROUTE) {
		return res.status(422).send({
			error: `Too many waypoints in this route (${array.length} waypoints).`,
			message: 'Maximum waypoints: ' + constants.MAXIMUM_WAYPOINTS_PER_ROUTE,
			waypoints: array,
		});
	}
	const { getReport } = require('./report');
	getReport(origin, destination, waypoints, increment)
		.then((report) => res.status(report.error == undefined ? 200 : 422).send(report))
		.catch(() => res.status(500).send(constants.DEFAULT_ERROR_MESSAGE));
});

module.exports = routes;
