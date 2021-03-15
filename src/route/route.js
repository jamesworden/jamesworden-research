/**
 * Create route from two addresses
 * @param {*} increment In meters
 * @returns
 */
async function getRoute(origin, destination, increment) {
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
	const axios = require('axios');
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
		return {
			error,
			message,
		};
	}
	// Google API call went through successfully; safe to extract data
	// Ensure difference in latitude or longitude does not differ by 1
	let bounds = data.routes[0].bounds;
	let latDif = Math.abs(bounds.northeast.lat - bounds.southwest.lat);
	let lngDif = Math.abs(bounds.northeast.lng - bounds.southwest.lng);

	// If difference in latitude or longitude > 1
	if (latDif > 1 || lngDif > 1) {
		return {
			error: 'Your addresses are too far apart!',
			solution:
				'Please enter locations that are within 1 latitude and longitude difference.',
		};
	}
	// Decode polyline into array of points
	const { decode } = require('polyline'); // Use the polyline package
	const calculations = require('../calculations');
	const route = decode(data.routes[0].overview_polyline.points);
	// Loop through all points; add points where distance is larger
	// than the increment size
	for (i = 0; i < route.length; i++) {
		// Define current point and next point
		let currentPoint = route[i];
		let nextPoint = route[i + 1];

		// If next point is undefined, current point is the last point.
		if (nextPoint == undefined) {
			break;
		}
		// Get distance between inital point and next point
		let distanceToNextPoint = calculations.getDistanceBetweenPoints(
			currentPoint[0], // Latitude of first point
			currentPoint[1], // Longitude of first point
			nextPoint[0], // Latitude of second point
			nextPoint[1] // Longitude of second point
		);
		// Check if distance is larger than increment
		if (distanceToNextPoint > increment) {
			// Incrementally create new point from current point
			let point = calculations.getIntermediatePoint(
				currentPoint[0],
				currentPoint[1],
				nextPoint[0],
				nextPoint[1],
				increment
			);
			// Insert new point right after the current 'i' value
			// This can cause an infinate loop if not done properly.
			route.splice(i + 1, 0, point);

			// Ensure 'i' remains the same on next iteration.
			// This can probably be removed once 'getPointsBetweenGpsCoordinates'
			// gets updated to create points incrementally.
			i -= 1;
		}
	}
	return {
		route,
	};
}

module.exports = {
	getRoute,
};
