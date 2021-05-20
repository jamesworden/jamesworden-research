import * as validation from '../util/Validation';

import Report from '../model/Report';
import Route from '../model/Route';
import constants from '../config/Constants';

let express = require('express');
let routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Define query parameters
	const key = req.query.key || '',
		origin = req.query.origin,
		destination = req.query.destination,
		waypoints = req.query.waypoints,
		increment = req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;

	if (req.query.sample && validation.equalsIgnoreCase(req.query.sample, 'true')) {
		let route = require('../sampledata/route.json');
		let detour = require('../sampledata/detour.json');
		res.status(200).send(new Report(route, detour));
		return;
	}

	// Validate query parameters
	if (validation.containsInvalidKey(key, res)) return;
	if (validation.containsInvalidIncrement(increment, res)) return;
	if (validation.containsUndefinedValues({ origin, destination, waypoints }, res)) return;
	if (validation.containsExtraWaypoints(waypoints, res)) return;

	let route = await new Route(origin, destination, increment).initialize();
	let detour = await new Route(origin, destination, increment, waypoints).initialize();
	let report = new Report(route, detour);

	res.status(200).send(report);
});

export default routes;
