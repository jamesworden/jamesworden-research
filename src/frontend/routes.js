const express = require('express');

// All frontend routes
const routes = express.Router({
	mergeParams: true,
});

// Dynamically rendering the enviornment variables into the ejs template
routes.get('/', async function (req, res) {
	// Get origin and destination values from queries
	origin = req.query.origin || '8000 Utopia Pkwy, Jamaica, NY 11439';
	destination = req.query.destination || '2, 168-46 91st Ave, 11432';
	increment = req.query.increment || 25; // Default 10 meters

	// Get file system module for injecting example code snippets
	const fs = require('fs');
	const { join } = require('path');

	// Code snippets from text files
	const javascript = fs.readFileSync(
		join(__dirname + '/example-code/javascript')
	);
	const java = fs.readFileSync(join(__dirname + '/example-code/java'));
	const python = fs.readFileSync(join(__dirname + '/example-code/python'));

	// Get the route and then render the page
	const { getRoute } = require('../route/route');
	getRoute(origin, destination, increment)
		.then((route) => {
			// The front end does not require parameters; the API does
			res.render('index.ejs', {
				// Google maps and route data
				GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
				origin,
				destination,
				increment,
				route: JSON.stringify(route),
				// Example code snippets
				javascript,
				java,
				python,
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
