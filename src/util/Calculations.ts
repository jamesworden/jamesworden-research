import Point from '../model/Point';
import { decode } from 'polyline';

/**
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */
const getDistanceBetweenPoints = (pointA: Point, pointB: Point): number => {
	const p = 0.017453292519943295; // Math.PI / 180
	const c = Math.cos;
	const a =
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
const getIntermediatePoint = (pointA: Point, pointB: Point, distance: number): Point => {
	const bearing = getBearingFromPoints(pointA, pointB);
	return getPointFromDistance(pointA, distance, bearing);
};

/**
 * https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
 * @returns initial bearing in degrees from North in degrees
 */
const getBearingFromPoints = (pointA: Point, pointB: Point): number => {
	const startLat: number = toRadians(pointA.getLatitude());
	const startLng: number = toRadians(pointA.getLongitude());
	const destLat: number = toRadians(pointB.getLatitude());
	const destLng: number = toRadians(pointB.getLongitude());
	const y: number = Math.sin(destLng - startLng) * Math.cos(destLat);
	const x: number =
		Math.cos(startLat) * Math.sin(destLat) -
		Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
	const bearing: number = toDegrees(Math.atan2(y, x));
	return (bearing + 360) % 360;
};

/**
 * https://stackoverflow.com/a/46410871/13549
 * @returns point that is a given distance and angle from a given point
 */
const getPointFromDistance = function (point: Point, distance: number, bearing: number): Point {
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
	const latitude = (radianLatitude * 180) / Math.PI;
	const longitude = (radianLongitude * 180) / Math.PI;
	return new Point(latitude, longitude);
};

/* Converts from degrees to radians. */
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/* Converts from radians to degrees. */
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

/**
 * Get distance from a given leg
 * @param {Object[]} legs Array of legs
 * @returns Distance in meters
 */
const getDistanceFromLegs = (legs: google.maps.DirectionsLeg[]): number => {
	let distance = 0;
	for (const leg of legs) {
		if (leg.distance != undefined && leg.distance.value != undefined)
			distance += leg.distance.value;
	}
	return distance;
};

/**
 * @param encodedPolyline Encoded polyline string returned by Google Directions route
 * @returns Array of points
 */
const getPointsFromEncodedPolyline = (encodedPolyline: string, increment: number): Point[] => {
	let decodedPoints: any[] = decode(encodedPolyline),
		validPoints: Point[] = [],
		distanceUntilNextPoint: number = 0, // Starts at 0 because 1st point should be added immediately
		currentPoint: Point = new Point(decodedPoints[0][0], decodedPoints[0][1]),
		i: number = 0;
	while (i < decodedPoints.length) {
		const decodedNextPoint = decodedPoints[i + 1];
		if (decodedNextPoint == undefined) break;
		const nextPoint: Point = new Point(decodedNextPoint[0], decodedNextPoint[1]),
			distanceBetweenPoints: number = getDistanceBetweenPoints(currentPoint, nextPoint);
		if (distanceBetweenPoints < distanceUntilNextPoint) {
			distanceUntilNextPoint -= distanceBetweenPoints;
			currentPoint = nextPoint;
			i++;
		} else {
			const newPoint: Point = getIntermediatePoint(
				currentPoint,
				nextPoint,
				distanceUntilNextPoint
			);
			validPoints.push(newPoint);
			currentPoint = newPoint; // Set current position to newly added point
			distanceUntilNextPoint = increment; // Point added, reset distance
		}
	}
	return validPoints;
};

export {
	getDistanceBetweenPoints,
	getIntermediatePoint,
	getPointFromDistance,
	getBearingFromPoints,
	getDistanceFromLegs,
	getPointsFromEncodedPolyline,
};
