const express = require('express');
const constants = require('../constants');
const { getRoute } = require('../route/route');
const { getReport } = require('../report/report');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Defining query parameters
	let route,
		report,
		error,
		origin,
		destination,
		increment,
		key = req.query.key;

	// If API key is correct, create new route; Else, use sample data
	if (key && key == process.env.RESEARCH_API_KEY) {
		origin = req.query.origin;
		destination = req.query.destination;
		increment = req.query.increment;
		route = await getRoute(origin, destination, increment, true, true, true, '', true);
	} else {
		let queriesExist = req.query.origin || req.query.destination || req.query.increment;
		if (!key && queriesExist) error = 'An API key is required for a custom route.';
		else if (key && queriesExist) error = 'Invalid API key! Contact James for assistance.';
		route = require('../sampledata/route.json');
		origin = route.origin;
		destination = route.destination;
		increment = constants.DEFAULT_INCREMENT_DISTANCE;
	}

	report = await getReport(route.route, route.detour);

	res.render('index.html', {
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
		numExampleCoordinatePairs: constants.NUM_EXAMPLE_COORDINATE_PAIRS,
		markerPlacementSpeed: constants.MARKER_PLACEMENT_SPEED,
		maxIncrement: constants.MAX_INCREMENT_DISTANCE,
		minIncrement: constants.MIN_INCREMENT_DISTANCE,
		report: JSON.stringify(report),
		route: JSON.stringify(route),
		origin,
		destination,
		increment,
		error, // Only defined when an error exists
		key,
	});
});

module.exports = routes;
