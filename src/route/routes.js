const { json } = require('body-parser');
const express = require('express');
const axios = require('axios');

// All route routes
const routes = express.Router({
	mergeParams: true,
});

// Get route
routes.get('/', async function (req, res) {
	// Get origin and destination values from queries
	const origin = req.query.origin;
	const destination = req.query.destination;

	// Get key from enviornment variable
	const key = process.env.GOOGLE_MAPS_API_KEY;

	// Fetch data from google directions using query data
	const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
	const queries = `?origin="${origin}"&destination="${destination}"&key=${key}`;
	let url = baseUrl + queries;

	// Fetch data from url with specified data
	response = await axios.get(url);
	data = response.data;

	// If there is no body to Google's response, inform user
	// Double !'s convert variable to boolean value if it is set or not
	googleReturnedData = typeof responseBody == undefined ? false : true;

	// Send the response back
	res.status(200).send({
		'Origin address': origin,
		'Destination address': destination,
		'Successfully connected to Google Maps API': googleReturnedData,
		'Response Body': data,
	});
});

// Export the routes
module.exports = {
	routes,
};

// Demonstration Addresses
// 8000 Utopia Pkwy, Jamaica, NY 11439
// 940 Madison Ave, New York, NY 10021
