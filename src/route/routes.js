const express = require('express');
const axios = require('axios');
require('dotenv').config();

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
	// Locally this will get taken from the .env file
	// When deployed, GitHub Actions will create a .env file in AWS
	let key = process.env.GOOGLE_MAPS_API_KEY;

	// Ensure API key has been defined
	if (key == undefined) {
		return res.status(422).send({
			error: 'Could not locate API Key!',
			solution: 'Please contact James for assistance.',
			route: [],
		});
	}

	// Fetch data from google directions using query data
	const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
	const queries = `?origin="${origin}"&destination="${destination}"&key=${key}`;
	let url = baseUrl + queries;

	// Fetch data from url with specified data
	let response = await axios.get(url);
	let data = response.data;

	// If Google API call status was not ok, inform user
	let status = data.status;
	if (status != 'OK') {
		// Create default error and solution statements
		let error = 'There was a error while processing your request.';
		let solution =
			'Please check your request or contact James for assistance.';

		// Each case statement modifies errors and solutions accordingly
		switch (status) {
			case 'NOT_FOUND':
				error =
					'The route between the given addresses could not be found!';
				solution =
					'Please check that you have inputted valid addresses.';
				break;
			case 'REQUEST_DENIED':
				error =
					'There was a problem fetching data from the Google API!';
				solution = 'Please contact James for assistance.';
				break;
			// Error handling can always be added to
		}
		// Return error messages to user
		return res.status(422).send({
			error,
			solution,
			route: [],
		});
	}

	// Google API call went through successfully; safe to extract data
	// Get encoded polyline of route
	const compressedPolylinePoints = data.routes[0].overview_polyline.points;

	// Decode polyline into array of points
	let polyline = require('polyline'); // Use the polyline package
	route = polyline.decode(compressedPolylinePoints);

	// Send the response back
	return res.status(200).send({
		route: route,
	});
});

// Export all the routes
module.exports = {
	routes,
};
