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
		panoid = validation.equalsIgnoreCase(req.query.panoid, 'true'),
		panotext = validation.equalsIgnoreCase(req.query.panotext, 'true'),
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

	console.log('Test');

	// Return route from addresses
	res.status(200).send(await new Route(origin, destination, increment, waypoints).initialize());
});

export default routes;
