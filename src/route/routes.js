const express = require('express');

// All route routes
const routes = express.Router({
	mergeParams: true,
});

// Get route
routes.get('/', async function (req, res) {
	// Query parameters
	const origin = req.query.origin;
	const destination = req.query.destination;
	const increment = req.query.increment || 25; // Default: 25 meters
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

	// Ensure origin was specified
	if (origin == undefined) {
		return res.status(422).send({
			error: 'You must specify an origin address!',
			message:
				"Try adding '&origin=ADDRESS' at the end of your API call.'",
			'example-address': '8000 Utopia Pkwy, Jamaica, NY 11439',
		});
	}
	// Ensure destination was specified
	if (destination == undefined) {
		return res.status(422).send({
			error: 'You must specify a destination address!',
			message:
				"Try adding '&destination=ADDRESS' at the end of your API call.'",
			'example-address': '8000 Utopia Pkwy, Jamaica, NY 11439',
		});
	}
	// Ensure increment is a positive integer between 1 and 100 meters
	if (isNaN(increment) || increment < 1 || increment > 100) {
		return res.status(422).send({
			error: 'Invalid increment size.',
			message:
				'Your increment parameter must be a value between 1 and 100!',
		});
	}

	// Return route from addresses
	const { getRoute } = require('./route');
	getRoute(origin, destination, increment, panoid, panotext)
		.then((route) => {
			let status = 200;
			if (route.route == undefined) status = 422;
			res.status(status).send(route); // Route is a JSON object
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send({
				error: 'Unable to create complete request!',
				message: 'Please contact James for assistance.',
			});
		});
});

// Export all the routes
module.exports = routes;
