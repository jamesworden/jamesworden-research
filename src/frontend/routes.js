const express = require('express');

// All frontend routes
const routes = express.Router({
	mergeParams: true,
});

// Dynamically rendering the enviornment variables into the ejs template
routes.get('/', async function (req, res) {
	// Get origin and destination values from queries
	// The front end does not require parameters; the API does
	res.render('index.ejs', {
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
		origin: req.query.origin || '8000 Utopia Pkwy, Jamaica, NY 11439',
		destination: req.query.destination || '2, 168-46 91st Ave, 11432',
		increment: req.query.increment || 10, // Default 10 meters
	});
});

// Export all the routes
module.exports = routes;
