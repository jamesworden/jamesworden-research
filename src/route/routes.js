const express = require('express');
const constants = require('../constants');
const utils = require('../utils');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	// Define query parameters
	const key = req.query.key,
		origin = req.query.origin,
		destination = req.query.destination,
		detour = utils.equalsIgnoreCase(req.query.detour, 'true'),
		panoid = utils.equalsIgnoreCase(req.query.panoid, 'true'),
		panotext = utils.equalsIgnoreCase(req.query.panotext, 'true'),
		increment = req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;

	// Validate query parameters
	if (utils.containsInvalidKey(key, res)) return;
	if (utils.containsInvalidIncrement(increment, res)) return;
	if (utils.containsUndefinedValues({ origin, destination }, res)) return;

	// Return route from addresses
	const { getRoute } = require('./route');
	getRoute(origin, destination, increment, panoid, panotext, true, '', detour)
		.then((route) => res.status(route.route == undefined ? 422 : 200).send(route))
		.catch((error) => {
			console.log(error);
			res.status(500).send(constants.DEFAULT_ERROR_MESSAGE);
		});
});

module.exports = routes;
