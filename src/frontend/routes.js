const express = require('express');

// All frontend routes
const routes = express.Router({
	mergeParams: true,
});

// Dynamically rendering the enviornment variables into the ejs template
routes.get('/', async function (req, res) {
	const origin = req.query.origin || 'New York, NY 10119';
	const destination =
		req.query.destination || '20 W 34th St, New York, NY 10001';
	const increment = req.query.increment || 25; // Default 25 meters

	const { getRoute } = require('../route/route');
	getRoute(origin, destination, increment)
		.then((route) => {
			// The front end does not require parameters; the API does
			res.render('index.html', {
				// Google maps and route data
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

// Export all the routes
module.exports = routes;
