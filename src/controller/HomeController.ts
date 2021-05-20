import Report from '../model/Report';
import Route from '../model/Route';
import constants from '../config/Constants';

let express = require('express');
let routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Defining query parameters
	let route,
		report,
		error,
		origin,
		destination,
		increment,
		detour,
		waypoints,
		key = req.query.key;

	// If API key is correct, create new route; Else, use sample data
	if (key && key == process.env.RESEARCH_API_KEY) {
		origin = req.query.origin;
		destination = req.query.destination;
		increment = req.query.increment;
		waypoints = req.query.waypoints;
		route = new Route(origin, destination, increment).initialize();
		detour = new Route(origin, destination, increment, waypoints).initialize();
	} else {
		let queriesExist = req.query.origin || req.query.destination || req.query.increment;
		if (!key && queriesExist) error = 'An API key is required for a custom route.';
		else if (key && queriesExist) error = 'Invalid API key! Contact James for assistance.';
		route = require('../sampledata/route.json');
		detour = require('../sampledata/detour.json');
		origin = route.origin;
		destination = route.destination;
		increment = route.increment;
	}

	report = new Report(route, detour);

	res.render('index.html', {
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
		numExampleCoordinatePairs: constants.NUM_EXAMPLE_COORDINATE_PAIRS,
		markerPlacementSpeed: constants.MARKER_PLACEMENT_SPEED,
		maxIncrement: constants.MAX_INCREMENT_DISTANCE,
		minIncrement: constants.MIN_INCREMENT_DISTANCE,
		report: JSON.stringify(report),
		route: JSON.stringify(route),
		detour: JSON.stringify(detour),
		waypoints: detour.waypoints,
		origin,
		destination,
		increment,
		error, // Only defined when an error exists
		key,
	});
});

export default routes;
