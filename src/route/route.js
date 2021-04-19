/**
 * Create route from two addresses
 * @param {String} origin Origin address
 * @param {String} destination Destination address
 * @param {Number} increment Increment distance in meters
 * @param {Boolean} panoid Return panorma Id's for each coordinate pair if true
 * @param {Boolean} panotext Returns Google Vision OCR text from the panorma images at each coordinate pair if true
 * @param {Boolean} location Returns the coordinate pairs along the route, set to true by default
 * @param {String} waypoints Waypoints that the route goes through ('ADDR1|ADDR2|ETC...')
 */
async function getRoute(
	origin,
	destination,
	increment,
	panoid = false,
	panotext = false,
	location = true,
	waypoints = ''
) {
	// Fetch route from Google Maps
	const key = process.env.GOOGLE_MAPS_BACKEND_KEY,
		url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&waypoints=${waypoints}`,
		axios = require('axios'),
		response = await axios.get(url),
		data = response.data,
		status = data.status;

	if (status != 'OK') {
		let error, message;
		switch (status) {
			case 'NOT_FOUND':
				error = 'The route between the given addresses could not be found!';
				message = 'Please check that you have inputted valid addresses.';
				break;
			case 'REQUEST_DENIED':
				error = 'There was a problem fetching data from the Google API!';
				message = 'Please contact James for assistance.';
				break;
			default:
				error = 'There was a error while processing your request.';
				message = 'Please check your request or contact James for assistance.';
				status = `Google Status Code: ${status}`;
		}
		return { error, message };
	}

	/**
	 * Google API call went through successfully; safe to extract data
	 * Get incremental points along the route
	 */

	const calculations = require('./calculations'),
		constants = require('../constants');

	// If difference in latitude or longitude is greater than 5 miles, throw an error
	let bounds = data.routes[0].bounds;
	let distance = calculations.getDistanceBetweenPoints(
		bounds.northeast.lat,
		bounds.northeast.lng,
		bounds.southwest.lat,
		bounds.southwest.lng
	);
	if (distance > constants.MAX_DISTANCE_BETWEEN_ADDRESSES) {
		return {
			error: `Your addresses are too far apart (${distance} meters)!`,
			solution: `Please enter locations that are within ${constants.MAX_DISTANCE_BETWEEN_ADDRESSES} meters of longitdue and latitdue from one another.`,
		};
	}
	// Decode polyline into array of points
	const { decode } = require('polyline'),
		points = decode(data.routes[0].overview_polyline.points);

	// Loop through the polyline points; push valid points to route array
	let i = 0,
		route = [],
		currentPosition = points[0], // Temporary marker
		distanceUntilNextPoint = 0; // Starts at 0 because 1st point should be added immediately

	while (i < points.length) {
		let nextPoint = points[i + 1];
		if (nextPoint == undefined) break;

		// Get distance between current position and next point
		let distanceBetweenPoints = calculations.getDistanceBetweenPoints(
			currentPosition[0], // Current position latitude
			currentPosition[1], // Current position longitude
			nextPoint[0], // Next Point latitude
			nextPoint[1] // Next Point longitude
		);
		if (distanceBetweenPoints < distanceUntilNextPoint) {
			distanceUntilNextPoint -= distanceBetweenPoints;
			currentPosition = points[i + 1];
			i++;
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
		}
	}

	/**
	 * Route created; now points must be snapped to nearest road.
	 * Google's 'Snap to Roads' API only takes 100 points per API call.
	 */

	let pointsRemaining = route.length, // Make API call every 100 points
		correctedRoute = [],
		apiCalls = 0,
		path = '';

	while (pointsRemaining > 0) {
		// Beginning and end indexes for points in route array
		minRouteIndex = apiCalls * 100; // 100 slots for each call that has already been made
		maxRouteIndex = minRouteIndex + 100; // 100 more than the minimum

		for (i = minRouteIndex; i < maxRouteIndex; i++) {
			let currentPoint = route[i];
			if (currentPoint == undefined) break; // End loop if there is no current point
			path += currentPoint[0] + ',' + currentPoint[1] + '|'; // Add current point coordinates to path string
		}
		url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`;
		response = await axios.get(url);
		snappedPoints = response.data.snappedPoints;
		if (snappedPoints == undefined) return constants.DEFAULT_ERROR_MESSAGE;

		// Loop through all snapped points and add them to corrected route array
		for (i = 0; i < snappedPoints.length; i++) {
			correctedRoute.push({ location: snappedPoints[i].location });
		}
		pointsRemaining -= 100;
		apiCalls++;
		path = '';
	}

	/**
	 * Corrected Route has been created.
	 * Add additional query data for each coordinate pair
	 */

	if (panoid || panotext || !location) {
		let promises = [];
		const { getPanoramaId, getPanoramaText } = require('./panorama'),
			vision = require('@google-cloud/vision'),
			client = new vision.ImageAnnotatorClient();

		// Loop through all coordinate pairs and push promises for each location
		for (i = 0; i < correctedRoute.length; i++) {
			(function (i) {
				const latitude = correctedRoute[i].location.latitude,
					longitude = correctedRoute[i].location.longitude;
				if (panoid) {
					promises.push(
						getPanoramaId(latitude, longitude).then((pano_id) => {
							correctedRoute[i]['pano_id'] = pano_id;
						})
					);
				}
				if (panotext) {
					correctedRoute[i]['pano_text'] = '';
					for (heading = 0; heading < 360; heading += 120) {
						promises.push(
							getPanoramaText(latitude, longitude, client, heading).then(
								(pano_text) => {
									correctedRoute[i]['pano_text'] += pano_text + ',';
								}
							)
						);
					}
				}
				if (!location) delete correctedRoute[i]['location'];
			})(i);
		}
		await Promise.all(promises);
	}
	return { route: correctedRoute };
}
module.exports = { getRoute };
