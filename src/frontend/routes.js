const express = require('express');
const constants = require('../constants');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Defining query parameters
	let route, error;
	const key = req.query.key,
		origin = req.query.origin || constants.DEFAULT_ORIGIN_ADDRESS,
		destination = req.query.destination || constants.DEFAULT_DESTINATION_ADDRESS,
		increment = req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;

	// API key is correct, create new route
	if (key && key == process.env.RESEARCH_API_KEY) {
		let { getRoute } = require('../route/route');
		getRoute(origin, destination, increment)
			.then((r) => (route = JSON.stringify(r)))
			.catch(() => (error = 'Unable to create complete request!'));
	}
	// API key is undefined or invalid, use sample route data
	else {
		let queriesExist = req.query.origin || req.query.destination || req.query.increment;
		if (!key && queriesExist)
			// User did not specify a key, but specified query parameters
			error = 'An API key is required for a custom route.';
		else if (key && queriesExist)
			// User specified an invalid key and query parameters
			error = 'Invalid API key! Contact James for assistance.';
		route = JSON.stringify(require('../sampledata/regular_route.json'));
	}
	res.render('index.html', {
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
		numExampleCoordinatePairs: constants.NUM_EXAMPLE_COORDINATE_PAIRS,
		origin,
		destination,
		increment,
		route,
		error, // Only defined when an error exists
	});
});

module.exports = routes;
