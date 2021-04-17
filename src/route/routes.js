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
	const increment =
		req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;
	const panoid =
		req.query.panoid == undefined ||
		req.query.panoid.toUpperCase() !== 'TRUE'
			? false
			: true;
	const panotext =
		req.query.panotext == undefined ||
		req.query.panotext.toUpperCase() !== 'TRUE'
			? false
			: true;

	if (utils.containsUndefinedValues({ origin, destination }, res)) return;
	if (utils.containsInvalidIncrement(increment, res)) return;

	// Return route from addresses
	const { getRoute } = require('./route');
	getRoute(origin, destination, increment, panoid, panotext)
		.then((route) => {
			let status = route.route == undefined ? 422 : 200;
			res.status(status).send(route);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send(constants.DEFAULT_ERROR_MESSAGE);
		});
});

module.exports = routes;
