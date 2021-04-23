const express = require('express');
const { getRoute } = require('../route/route');
const { getReport } = require('./report');
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

	if (req.query.sample && utils.equalsIgnoreCase(req.query.sample, 'true')) {
		route = require('../sampledata/route.json');
		detour = require('../sampledata/detour.json');
		res.status(200).send(await getReport(route, detour));
		return;
	}

	// Validate query parameters
	if (utils.containsInvalidKey(key, res)) return;
	if (utils.containsInvalidIncrement(increment, res)) return;
	if (utils.containsUndefinedValues({ origin, destination, waypoints }, res)) return;
	if (utils.containsExtraWaypoints(waypoints, res)) return;

	route = await getRoute(origin, destination, increment, false, true, true);
	detour = await getRoute(origin, destination, increment, false, true, true, waypoints);

	if (route.error || detour.error) {
		res.status(422).send({
			error: {
				route: route.error,
				detour: detour.error,
			},
		});
		return;
	}

	getReport(route, detour)
		.then((report) => res.status(report.error == undefined ? 200 : 422).send(report))
		.catch((error) => {
			console.log(error);
			res.status(500).send(constants.DEFAULT_ERROR_MESSAGE);
		});
});

module.exports = routes;
