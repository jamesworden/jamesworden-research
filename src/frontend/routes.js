const express = require('express');
const constants = require('../constants');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Defining query parameters
	let route,
		report,
		error,
		detour,
		origin,
		destination,
		increment,
		key = req.query.key;

	// API key is correct, create new route
	if (key && key == process.env.RESEARCH_API_KEY) {
		origin = req.query.origin;
		destination = req.query.destination;
		increment = req.query.increment;
		const { getRoute } = require('../route/route');
		await getRoute(origin, destination, increment)
			.then((r) => (route = r))
			.catch(() => (error = 'Unable to create complete request!'));
		const { getDetour } = require('../route/detour');
		await getDetour(route, increment)
			.then((d) => (detour = d))
			.catch(() => (error = 'Unable to create complete request!'));
	}
	// API key is undefined or invalid, use sample route data
	else {
		let queriesExist = req.query.origin || req.query.destination || req.query.increment;
		if (!key && queriesExist) error = 'An API key is required for a custom route.';
		else if (key && queriesExist) error = 'Invalid API key! Contact James for assistance.';
		route = require('../sampledata/regular_text_route.json');
		detour = require('../sampledata/detour_text_route.json');
		origin = constants.DEFAULT_ORIGIN_ADDRESS;
		destination = constants.DEFAULT_DESTINATION_ADDRESS;
		increment = constants.DEFAULT_INCREMENT_DISTANCE;
	}

	const { getReport } = require('../report/report');
	await getReport(route, detour)
		.then((r) => (report = r))
		.catch(() => (error = 'Unable to create complete request!'));

	res.render('index.html', {
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
		numExampleCoordinatePairs: constants.NUM_EXAMPLE_COORDINATE_PAIRS,
		maxIncrement: constants.MAX_INCREMENT_DISTANCE,
		minIncrement: constants.MIN_INCREMENT_DISTANCE,
		report: JSON.stringify(report),
		route: JSON.stringify(route),
		detour: JSON.stringify(detour),
		origin,
		destination,
		increment,
		error, // Only defined when an error exists
		key,
	});
});

module.exports = routes;
