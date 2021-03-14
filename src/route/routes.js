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
	const increment = req.query.increment || 10; // Default 10 meters

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

	// Get Google Maps API key from .env file
	// Locally this will get taken from the .env file
	// When deployed, GitHub Actions will create a .env file in AWS
	let key = process.env.GOOGLE_MAPS_API_KEY;

	// Ensure API key has been defined
	if (key == undefined) {
		return res.status(422).send({
			error: 'Could not locate API Key!',
			message: 'Please contact James for assistance.',
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
		// Each case statement modifies errors and solutions accordingly
		let error, message;
		switch (status) {
			case 'NOT_FOUND':
				error =
					'The route between the given addresses could not be found!';
				message =
					'Please check that you have inputted valid addresses.';
				break;
			case 'REQUEST_DENIED':
				error =
					'There was a problem fetching data from the Google API!';
				message = 'Please contact James for assistance.';
				break;
			default:
				error = 'There was a error while processing your request.';
				message =
					'Please check your request or contact James for assistance.';
		}
		// Return error messages to user
		return res.status(422).send({
			error,
			message,
		});
	}

	// Google API call went through successfully; safe to extract data

	// Ensure difference in latitude or longitude does not differ by 1
	let bounds = data.routes[0].bounds;
	let latDif = Math.abs(bounds.northeast.lat - bounds.southwest.lat);
	let lngDif = Math.abs(bounds.northeast.lng - bounds.southwest.lng);

	// If difference in latitude or longitude > 1
	if (latDif > 1 || lngDif > 1) {
		return res.status(422).send({
			error: 'Your addresses are too far apart!',
			solution:
				'Please enter locations that are within 1 latitude and longitude difference.',
			route: [],
		});
	}
	// Get encoded polyline of route
	const compressedPolylinePoints = data.routes[0].overview_polyline.points;

	// Decode polyline into array of points
	const polyline = require('polyline'); // Use the polyline package
	const polylinePoints = polyline.decode(compressedPolylinePoints);

	// Get the optimized and incremented route
	const { createRoute } = require('./calculations');
	const route = createRoute(polylinePoints, increment); // JSON Object

	// Send the response back
	return res.status(200).send({
		route,
	});
});

// Export all the routes
module.exports = routes;
