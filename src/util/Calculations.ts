import Point from '../model/Point';

/**
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */
let getDistanceBetweenPoints = (pointA: Point, pointB: Point): number => {
	var p = 0.017453292519943295; // Math.PI / 180
	var c = Math.cos;
	var a =
		0.5 -
		c((pointB.getLatitude() - pointA.getLatitude()) * p) / 2 +
		(c(pointA.getLatitude() * p) *
			c(pointB.getLatitude() * p) *
			(1 - c((pointB.getLongitude() - pointA.getLongitude()) * p))) /
			2;
	return 12742000 * Math.asin(Math.sqrt(a));
};

/**
 * @author James Worden
 * @returns point between two points that is a certain distance away from the first
 */
let getIntermediatePoint = (pointA: Point, pointB: Point, distance: number): Point => {
	let bearing = getBearingFromPoints(pointA, pointB);
	return getPointFromDistance(pointA, distance, bearing);
};

/**
 * https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
 * @returns initial bearing in degrees from North in degrees
 */
let getBearingFromPoints = (pointA: Point, pointB: Point): number => {
	let startLat: number = toRadians(pointA.getLatitude());
	let startLng: number = toRadians(pointA.getLongitude());
	let destLat: number = toRadians(pointB.getLatitude());
	let destLng: number = toRadians(pointB.getLongitude());
	var y: number = Math.sin(destLng - startLng) * Math.cos(destLat);
	var x: number =
		Math.cos(startLat) * Math.sin(destLat) -
		Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
	var bearing: number = toDegrees(Math.atan2(y, x));
	return (bearing + 360) % 360;
};

/**
 * https://stackoverflow.com/a/46410871/13549
 * @returns point that is a given distance and angle from a given point
 */
let getPointFromDistance = function (point: Point, distance: number, bearing: number): Point {
	distance /= 1000; // Convert distance from M to KM
	bearing = (bearing * Math.PI) / 180; // Convert bearing to radian
	let radius = 6378.1, // Radius of the Earth
		radianLatitude = (point.getLatitude() * Math.PI) / 180, // Current coords to radians
		radianLongitude = (point.getLongitude() * Math.PI) / 180;

	radianLatitude = Math.asin(
		Math.sin(radianLatitude) * Math.cos(distance / radius) +
			Math.cos(radianLatitude) * Math.sin(distance / radius) * Math.cos(bearing)
	);
	radianLongitude += Math.atan2(
		Math.sin(bearing) * Math.sin(distance / radius) * Math.cos(radianLongitude),
		Math.cos(distance / radius) - Math.sin(radianLongitude) * Math.sin(radianLongitude)
	);

	// Coords back to degrees and return
	let latitude = (radianLatitude * 180) / Math.PI;
	let longitude = (radianLongitude * 180) / Math.PI;
	return new Point(latitude, longitude);
};

/* Converts from degrees to radians. */
let toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/* Converts from radians to degrees. */
let toDegrees = (radians: number): number => (radians * 180) / Math.PI;

export {
	getDistanceBetweenPoints,
	getIntermediatePoint,
	getPointFromDistance,
	getBearingFromPoints,
};
