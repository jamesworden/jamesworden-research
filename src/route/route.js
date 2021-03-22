/**
 * Create route from two addresses
 * @param increment In meters
 */
async function getRoute(origin, destination, increment) {
	// Get Google Maps API key from .env file
	// Locally this will get taken from the .env file
	// When deployed, GitHub Actions will create a .env file in AWS
	let key = process.env.GOOGLE_MAPS_BACKEND_KEY;

	// Ensure API key has been defined
	if (key == undefined) {
		return {
			error: 'Could not locate API Key!',
			message: 'Please contact James for assistance.',
		};
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
	const points = decode(data.routes[0].overview_polyline.points);

	const calculations = require('../calculations');
	let route = []; // Route array begins with first point always

	let i = 0; // Point index;
	let currentPosition = points[0]; // Not an actual point, just a temporary marker
	let distanceUntilNextPoint = 0; // Starts at 0 because 1st point should be added immediately

	// Loop through the polyline points; push valid points to route array
	while (i < points.length) {
		// Define next point
		let nextPoint = points[i + 1];

		// End loop if there is no next point
		if (nextPoint == undefined) {
			break;
		}
		// Get distance between current position and next point
		let distanceBetweenPoints = calculations.getDistanceBetweenPoints(
			currentPosition[0], // Latitude of current position
			currentPosition[1], // Longitude of current position
			nextPoint[0], // Latitude of second point
			nextPoint[1] // Longitude of second point
		);
		// Distance where the next point of the route should be
		if (distanceBetweenPoints < distanceUntilNextPoint) {
			// Not far enough from current point, record distance and goto next
			distanceUntilNextPoint -= distanceBetweenPoints;
			currentPosition = points[i + 1];
			i++; // Go to next point
		} else {
			// Incrementally create new point from current point
			let newPoint = calculations.getIntermediatePoint(
				currentPosition[0],
				currentPosition[1],
				nextPoint[0],
				nextPoint[1],
				distanceUntilNextPoint
			);

			route.push(newPoint);
			currentPosition = newPoint; // Set current position to newly added point
			distanceUntilNextPoint = increment; // Point added, reset distance

			// Don't increment i; not yet there
		}
	}

	// Route created; now points must be snapped to nearest road.
	// Google's 'Snap to Roads' API only takes 100 points per API call.

	// Make API call for every 100 points
	let pointsRemaining = route.length;
	let correctedRoute = [];
	let apiCalls = 0;
	let path = '';

	while (pointsRemaining > 0) {
		// Beginning and end indexes for points in route array
		minRouteIndex = apiCalls * 100; // 100 slots for each call that has already been made
		maxRouteIndex = minRouteIndex + 100; // 100 more than the minimum

		for (i = minRouteIndex; i < maxRouteIndex; i++) {
			// Define current and next points
			let currentPoint = route[i];
			let nextPoint = route[i + 1];

			// End loop if there is no current point
			if (currentPoint == undefined) {
				break;
			}
			// Add coordinates of current point to path string
			path += currentPoint[0] + ',' + currentPoint[1];
			if (nextPoint != undefined && i + 1 < maxRouteIndex) {
				// Add '|' if next point exists and is apart of this set of 100 points
				path += '|';
			}
		}

		// Create URL from path
		url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`;
		response = await axios.get(url);
		snappedPoints = response.data.snappedPoints;

		// Ensure data was returned
		if (snappedPoints == undefined) {
			return {
				error: 'There was a error while processing your request.',
				message:
					'Please check your request or contact James for assistance.',
			};
		}

		// Loop through all snapped points and add them to corrected route array
		for (i = 0; i < snappedPoints.length; i++) {
			location = snappedPoints[i].location;
			correctedRoute.push([location.latitude, location.longitude]);
		}

		pointsRemaining -= 100;
		apiCalls++;
		path = '';
	}

	return {
		route: correctedRoute,
	};
}

module.exports = {
	getRoute,
};
