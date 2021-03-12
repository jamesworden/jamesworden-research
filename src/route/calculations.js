/**
 * Create route from array of polyline points
 * @param {*} polylinePoints Array of gps coordinate pairs stored as arrays
 * @param {*} distanceBetweenPoints Always in meters
 * @returns
 */
module.exports.createRoute = (polylinePoints, distanceBetweenPoints = 10) => {
	let route = polylinePoints;
	for (i = 0; i < route.length; i++) {
		// Define current point and next point
		let currentPoint = route[i];
		let nextPoint = route[i + 1];

		// If next point is undefined, current point is the last point.
		if (nextPoint == undefined) {
			break;
		}
		// Ensure difference in latitude or longitude does not differ by 1
		let latDif = Math.abs(currentPoint[0] - nextPoint[0]);
		let lonDif = Math.abs(currentPoint[1] - nextPoint[1]);
		if (latDif > 1 || lonDif > 1) {
			return {
				error:
					'Your latitude or longitude points differ too much!' +
					`Error between: (${currentPoint[0]},${currentPoint[1]})` +
					`(${nextPoint[0]},${nextPoint[1]})`,
				solution:
					'Please enter coordinates that are within 1 latitude or longitude difference.',
				route: [],
			};
		}
		// Get distance between inital point and next point
		let distanceToNextPoint = getDistanceBetweenGpsCoordinates(
			currentPoint[0], // Latitude of first point
			currentPoint[1], // Longitude of first point
			nextPoint[0], // Latitude of second point
			nextPoint[1] // Longitude of second point
		);
		// Check if distance is larger than increment
		if (distanceToNextPoint > distanceBetweenPoints) {
			// Incrementally create new point from current point
			let point = getPointBetweenGpsCoordinates(
				currentPoint[0],
				currentPoint[1],
				nextPoint[0],
				nextPoint[1],
				distanceBetweenPoints
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
};

/**
 * Function from 'https://www.geodatasource.com/developers/javascript'
 * GeoDataSource.com (C) All Rights Reserved 2018
 * Modified by James Worden
 */
const getDistanceBetweenGpsCoordinates = (lat1, lon1, lat2, lon2) => {
	// Ensure there is a change in latitude or longitude
	if (lat1 == lat2 && lon1 == lon2) {
		return 0;
	}
	// Calculations
	var radlat1 = (Math.PI * lat1) / 180;
	var radlat2 = (Math.PI * lat2) / 180;
	var theta = lon1 - lon2;
	var radtheta = (Math.PI * theta) / 180;
	var dist =
		Math.sin(radlat1) * Math.sin(radlat2) +
		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist = dist * 60 * 1.1515;

	// Convert to meters
	dist *= 1609.344;

	// Return distance
	return dist;
};

/**
 * Get the coordinates of a point between two points
 * that is a certain distance away from the first
 *
 * @param {*} x1 X coordinate of 1st point
 * @param {*} y1 Y coordinate of 1st point
 * @param {*} x2 X coordinate of 2nd point
 * @param {*} y2 Y coordinate of 2nd point
 * @returns
 */
const getPointBetweenGpsCoordinates = (x1, y1, x2, y2, distance) => {
	// Currently, this will return points directly inbetween the next.
	// This does not do the points incrementally.
	let xAvg = (x1 + x2) / 2;
	let yAvg = (y1 + y2) / 2;
	return [xAvg, yAvg];
};
