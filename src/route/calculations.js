/**
 * Create route from array of polyline points
 * @param {*} polylinePoints Array of gps coordinate pairs stored as arrays
 * @param {*} distanceBetweenPoints In meters
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
 * Function by 'https://stackoverflow.com/users/1090562/salvador-dali' on StackOverflow
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * Modified by James Worden
 */
const getDistanceBetweenGpsCoordinates = (lat1, lon1, lat2, lon2) => {
	var p = 0.017453292519943295; // Math.PI / 180
	var c = Math.cos;
	var a =
		0.5 -
		c((lat2 - lat1) * p) / 2 +
		(c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

	// For kilometers, use 12742. For meters, use 12742000.
	return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

/**
 * Get the coordinates of a point between two points
 * that is a certain distance away from the first
 */
const getPointBetweenGpsCoordinates = (lat1, lng1, lat2, lng2, distance) => {
	let bearing = calculations.getBearingFromPoints(lat1, lng1, lat2, lng2);
	return calculations.getPointFromDistance(lat1, lng1, distance, bearing);
};

/**
 * Returns the (initial) bearing from this point to the supplied point, in degrees.
 * See http://williams.best.vwh.net/avform.htm#Crs
 * @returns initial bearing in degrees from North
 */
module.exports.getBearingFromPoints = (lat1, lng1, lat2, lng2) => {
	let dLon = lng2 - lng1;
	let y = Math.sin(dLon) * Math.cos(lat2);
	let x =
		Math.cos(lat1) * Math.sin(lat2) -
		Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
	let radians = Math.atan2(y, x); // In radians
	let brng = (radians * 180) / Math.PI; // In degrees
	return 360 - ((brng + 360) % 360);
};

/**
 * With inspiration from https://stackoverflow.com/a/46410871/13549
 * @param distance In meters
 * @param bearing In degrees
 * @returns
 */
module.exports.getPointFromDistance = function (lat, lng, distance, bearing) {
	distance /= 1000; // Convert distance from M to KM
	const R = 6378.1; // Radius of the Earth
	const brng = (bearing * Math.PI) / 180; // Convert bearing to radian
	lat = (lat * Math.PI) / 180; // Current coords to radians
	lng = (lng * Math.PI) / 180;

	// Do the math magic
	lat = Math.asin(
		Math.sin(lat) * Math.cos(distance / R) +
			Math.cos(lat) * Math.sin(distance / R) * Math.cos(brng)
	);
	lng += Math.atan2(
		Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat),
		Math.cos(distance / R) - Math.sin(lat) * Math.sin(lat)
	);

	// Coords back to degrees and return
	return [(lat * 180) / Math.PI, (lng * 180) / Math.PI];
};
