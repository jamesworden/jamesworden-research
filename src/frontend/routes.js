const express = require('express');
const constants = require('../constants');

const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req, res) {
	const origin = req.query.origin || constants.DEFAULT_ORIGIN_ADDRESS;
	const destination =
		req.query.destination || constants.DEFAULT_DESTINATION_ADDRESS;
	const increment =
		req.query.increment || constants.DEFAULT_INCREMENT_DISTANCE;

	const { getRoute } = require('../route/route');
	getRoute(origin, destination, increment)
		.then((route) => {
			res.render('index.html', {
				GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
				origin,
				destination,
				increment,
				route: JSON.stringify(route),
			});
		})
		.catch(() => {
			res.status(500).send({
				error: 'Unable to create complete request!',
				message: 'Please contact James for assistance.',
			});
		});
});

module.exports = routes;
