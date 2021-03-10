const { json } = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');

const routes = express.Router({
	mergeParams: true,
});

routes.get('/', (req, res) => {
	// Get origin and destination values from queries
	const origin = req.query.origin;
	const destination = req.query.destination;

	console.log(origin, destination);

	// Get key from enviornment variable
	const key = process.env.GOOGLE_MAPS_API_KEY;

	// Fetch data from google directions using query data
	const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
	const queries = `?origin="${origin}"&destination="${destination}"&key=${key}`;
	const url = baseUrl + queries;

	// Data that goes with fetch
	const data = {
		mode: 'cors',
		cache: 'no-cache',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
	};

	let fetchRequest;
	let fetchResponse;

	// Fetch data from url with specified data
	fetch(url, data)
		.then((req) => {
			fetchRequest = JSON.stringify(req.body);
		})
		.catch((res) => {
			fetchResponse = JSON.stringify(res.body);
		});

	res.status(200).send({
		'Origin Query': origin,
		'Destination Query': destination,
		'Fetch Request': fetchRequest,
		'Fetch Response': fetchResponse,
	});
});

// Export the routes
module.exports = {
	routes,
};

// Demonstration Addresses
// 8000 Utopia Pkwy, Jamaica, NY 11439
// 940 Madison Ave, New York, NY 10021
