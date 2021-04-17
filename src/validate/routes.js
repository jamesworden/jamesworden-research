const express = require('express');
const constants = require('../constants');
const utils = require('../utils');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	/**
	 * Validate Query Parameters
	 */
	const origin = req.query.origin;
	const destination = req.query.destination;
	const waypoints = req.query.waypoints;
	const increment =
		req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;

	if (utils.containsUndefinedValues({ origin, destination, waypoints }, res))
		return;
	if (utils.containsInvalidIncrement(increment, res)) return;

	// Ensure number of waypoints is valid
	let array = waypoints.split('|');
	if (array.length > constants.MAXIMUM_WAYPOINTS_PER_ROUTE) {
		return res.status(422).send({
			error: `Too many waypoints in this route (${array.length} waypoints).`,
			message:
				'Maximum waypoints: ' + constants.MAXIMUM_WAYPOINTS_PER_ROUTE,
			waypoints: array,
		});
	}

	const { getReport } = require('./report');
	getReport(origin, destination, waypoints, increment)
		.then((report) => {
			let status = report.error == undefined ? 200 : 422;
			res.status(status).send(report);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send(constants.DEFAULT_ERROR_MESSAGE);
		});
});

module.exports = routes;
