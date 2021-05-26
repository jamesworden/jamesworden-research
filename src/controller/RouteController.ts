import * as validation from '../util/Validation';

import Route from '../model/Route';
import constants from '../config/Constants';

let express = require('express');
let routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Define query parameters
	const key = req.query.key,
		origin = req.query.origin,
		destination = req.query.destination,
		panoramaId = validation.equalsTrue(req.query.panoid),
		panoramaText = validation.equalsTrue(req.query.panotext),
		increment = req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE,
		waypoints = req.query.waypoints || '';

	if (req.query.sample && validation.equalsIgnoreCase(req.query.sample, 'true')) {
		res.status(200).send({ route: require('../sampledata/route.json') });
		return;
	}

	// Validate query parameters
	if (validation.containsInvalidKey(key, res)) return;
	if (validation.containsExtraWaypoints(waypoints, res)) return;
	if (validation.containsInvalidIncrement(increment, res)) return;
	if (validation.containsUndefinedValues({ origin, destination }, res)) return;

	// Return route from addresses
	var route: Route = new Route(origin, destination, increment, waypoints),
		route = await route.initialize(),
		route = await route.addParameters(panoramaId, panoramaText);
	res.status(200).send(route);
});

export default routes;
