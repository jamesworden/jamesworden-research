/**
 * Create route from two addresses
 * @param {String} origin Origin address
 * @param {String} destination Destination address
 * @param {Number} increment Increment distance in meters
 * @param {Boolean} panoid Return panorma Id's for each coordinate pair if true
 * @param {Boolean} panotext Returns Google Vision OCR text from the panorma images at each coordinate pair if true
 * @param {Boolean} location Returns the coordinate pairs along the route, set to true by default
 * @param {String} waypoints Waypoints that the detour route goes through ('ADDR1|ADDR2|ETC...')
 * @param {Boolean} detour If the route should include a generated detour with it as well
 */
async function getRoute(
	origin,
	destination,
	increment,
	panoid = false,
	panotext = false,
	location = true,
	waypoints = '',
	detour = false
) {
	// Fetch route from Google Maps
	const key = process.env.GOOGLE_MAPS_BACKEND_KEY,
		axios = require('axios');

	url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&waypoints=${
		detour ? '' : waypoints // Only get route with waypoints when it is not a detour.
	}`;
	response = await axios.get(url);
	data = response.data;
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
	 * Google API call went through successfully, Ensure route is acceptable,
	 * Get route from polyline points
	 */

	const calculations = require('./calculations'),
		constants = require('../constants');

	// If total route distance is too long, throw an error
	const legs = data.routes[0]['legs'];
	let distance = 0;
	for (leg of legs) distance += leg['distance']['value'];
	if (distance > constants.MAX_ROUTE_DISTANCE) {
		return {
			error: `The specified route is too long (${distance} meters)!`,
			solution: `Please enter locations that are closer to one another; The cumulative distance must be less than ${constants.MAX_ROUTE_DISTANCE} meters.`,
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
			newPoint = [newPoint['latitude'], [newPoint['longitude']]];
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
		path = path.slice(0, -1);
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

	/**
	 * Route created. If detour, get sub-route between first quartile and third quartile.
	 * A detour waypoint should be created above the midpoint.
	 */

	if (detour) {
		length = correctedRoute.length;
		firstQuartileIndex = Math.floor(length / 4);
		midpointIndex = Math.floor(length / 2);
		thirdQuartileIndex = Math.floor(length * (3 / 4));

		originPoint = correctedRoute[firstQuartileIndex]['location'];
		midpoint = correctedRoute[midpointIndex]['location'];
		destinationPoint = correctedRoute[thirdQuartileIndex]['location'];

		bearing = calculations.getBearingFromPoints(
			midpoint['latitude'],
			midpoint['longitude'],
			destinationPoint['latitude'],
			destinationPoint['longitude']
		);
		waypoint = calculations.getPointFromDistance(
			midpoint['latitude'],
			midpoint['longitude'],
			constants.DEFAULT_DETOUR_DISTANCE,
			bearing + 90 // Subtract 90 to make detour waypoint perpendicular to route
		);
		url = `https://roads.googleapis.com/v1/snapToRoads?path=${waypoint.latitude},${waypoint.longitude}&key=${key}`;
		response = await axios.get(url);
		waypoint = response.data.snappedPoints[0]['location'];
		detour = await getRoute(
			`${originPoint.latitude},${originPoint.longitude}`,
			`${destinationPoint.latitude},${destinationPoint.longitude}`,
			increment,
			panoid,
			panotext,
			location,
			`${waypoint.latitude},${waypoint.longitude}`
		);

		// Stitch detour portion with route portion
		firstLeg = correctedRoute.slice(0, firstQuartileIndex);
		lastLeg = correctedRoute.slice(thirdQuartileIndex, length);
		detourRoute = firstLeg.concat(detour.route).concat(lastLeg);

		return {
			origin,
			destination,
			route: correctedRoute,
			detour: detourRoute,
			detour_waypoint: waypoint,
		};
	}
	return { route: correctedRoute };
}
module.exports = { getRoute };
