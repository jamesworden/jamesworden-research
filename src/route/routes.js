const express = require('express');
const axios = require('axios');
const secretManager = require('../secretManager');

// All route routes
const routes = express.Router({
	mergeParams: true,
});

// Get route
routes.get('/', async function (req, res) {
	// Get origin and destination values from queries
	const origin = req.query.origin;
	const destination = req.query.destination;

	// Ensure origin was specified
	if (origin == undefined) {
		return res.status(422).send({
			error: 'You must specify an origin address!',
			solution:
				"Try adding '&origin=ADDRESS' at the end of your API call.'",
			'example-address': '8000 Utopia Pkwy, Jamaica, NY 11439',
			route: [],
		});
	}

	// Ensure destination was specified
	if (destination == undefined) {
		return res.status(422).send({
			error: 'You must specify a destination address!',
			solution:
				"Try adding '&destination=ADDRESS' at the end of your API call.'",
			'example-address': '8000 Utopia Pkwy, Jamaica, NY 11439',
			route: [],
		});
	}

	// Get Google Maps API key from .env file
	let key = process.env.GOOGLE_MAPS_API_KEY;
	// Key is undefined, check AWS Secrets for API Key
	if (key == undefined) {
		key = secretManager.getSecret('GOOGLE_MAPS_API_KEY');
		// Testing
		console.log('Route.js secret: ' + key);
	}

	// Fetch data from google directions using query data
	const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
	const queries = `?origin="${origin}"&destination="${destination}"&key=${key}`;
	let url = baseUrl + queries;

	// Fetch data from url with specified data
	response = await axios.get(url);
	data = response.data;

	// Send the response back
	return res.status(200).send({
		'Response Body': data,
	});
});

// Export the routes
module.exports = {
	routes,
};
