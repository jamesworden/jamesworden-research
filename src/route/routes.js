const express = require('express');

// All route routes
const routes = express.Router({
	mergeParams: true,
});

// Get route
routes.get('/', async function (req, res) {
	// Get origin and destination values from queries
	const origin = req.query.origin;
	const destination = req.query.destination;
	const increment = req.query.increment || 25; // Default 10 meters

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
	// Return route from addresses
	const { getRoute } = require('./route');
	getRoute(origin, destination, increment)
		.then((route) => {
			// Error Handling
			let status = 200;
			if (route.route == undefined) {
				status = 500;
			}
			// Successful Response
			res.status(200).send({
				route,
			});
		})
		.catch(() => {
			res.status(500).send({
				error: 'Unable to create complete request!',
				message: 'Please contact James for assistance.',
			});
		});
});

// Export all the routes
module.exports = routes;
