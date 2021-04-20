/**
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * Modified by James Worden
 */
const getDistanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
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
const getIntermediatePoint = (lat1, lng1, lat2, lng2, distance) => {
	let bearing = getBearingFromPoints(lat1, lng1, lat2, lng2);
	return getPointFromDistance(lat1, lng1, distance, bearing);
};

/**
 * https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
 * @returns initial bearing in degrees from North in degrees
 */
const getBearingFromPoints = (startLat, startLng, destLat, destLng) => {
	startLat = toRadians(startLat);
	startLng = toRadians(startLng);
	destLat = toRadians(destLat);
	destLng = toRadians(destLng);
	y = Math.sin(destLng - startLng) * Math.cos(destLat);
	x =
		Math.cos(startLat) * Math.sin(destLat) -
		Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
	brng = Math.atan2(y, x);
	brng = toDegrees(brng);
	return (brng + 360) % 360;
};

/**
 * Inspiration from https://stackoverflow.com/a/46410871/13549
 * @param distance In meters
 * @param bearing In degrees
 * @returns
 */
const getPointFromDistance = function (lat, lng, distance, bearing) {
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
	return {
		latitude: (lat * 180) / Math.PI,
		longitude: (lng * 180) / Math.PI,
	};
};

/**
 * Converts from degrees to radians.
 */
function toRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

/**
 *  Converts from radians to degrees.
 */
function toDegrees(radians) {
	return (radians * 180) / Math.PI;
}

module.exports = {
	getDistanceBetweenPoints,
	getIntermediatePoint,
	getPointFromDistance,
	getBearingFromPoints,
};
