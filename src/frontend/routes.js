const express = require('express');

// All frontend routes
const routes = express.Router({
	mergeParams: true,
});

// Dynamically rendering the enviornment variables into the ejs template
routes.get('/', async function (req, res) {
	// Get origin and destination values from queries
	origin = req.query.origin || 'New York, NY 10119';
	destination = req.query.destination || '20 W 34th St, New York, NY 10001';
	increment = req.query.increment || 25; // Default 25 meters
	panorama = req.query.panorama || false; // Default don't display panorama Id's

	// Get the route and then render the page
	const { getRoute } = require('../route/route');
	getRoute(origin, destination, increment)
		.then((route) => {
			// The front end does not require parameters; the API does
			res.render('index.ejs', {
				// Google maps and route data
				GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
				origin,
				destination,
				increment,
				panorama,
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
