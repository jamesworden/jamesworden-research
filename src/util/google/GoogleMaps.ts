import Point from '../../model/Point';
import axios from 'axios';

const key = process.env.GOOGLE_MAPS_BACKEND_KEY;

/**
 * Get directions from Google Maps
 * @param {String} origin
 * @param {String} destination
 * @param {String} waypoints
 * @returns Object containing directions data
 */
let getDirections = async (
	origin: string,
	destination: string,
	waypoints: string
): Promise<any> => {
	let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&waypoints=${waypoints}`,
		response = await axios.get(url);
	return response.data;
};

/**
 * Get snapped points from Google
 * @param {Point[]} points
 * @returns Promise returning an array of snapped points
 */
let getSnappedPoints = async (points: Point[]): Promise<Point[]> => {
	let pointsRemaining = points.length, // Make API call every 100 points
		route: Point[] = [],
		apiCalls: number = 0,
		path: string = '';
	while (pointsRemaining > 0) {
		// Beginning and end indexes for points in route array
		let minRouteIndex: number = apiCalls * 100, // 100 slots for each call that has already been made
			maxRouteIndex: number = minRouteIndex + 100; // 100 more than the minimum
		for (let i = minRouteIndex; i < maxRouteIndex; i++) {
			let currentPoint = points[i];
			if (currentPoint == undefined) break; // End loop if there is no current point
			path += currentPoint.getLatitude() + ',' + currentPoint.getLongitude() + '|'; // Add current point coordinates to path string
		}
		path = path.slice(0, -1);
		let url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`,
			response = await axios.get(url),
			snappedPoints = response.data.snappedPoints;
		if (snappedPoints == undefined) return [];
		// Loop through all snapped points and add them to corrected route array
		for (let i = 0; i < snappedPoints.length; i++) {
			let p = snappedPoints[i]['location'];
			route.push(new Point(p['latitude'], p['longitude']));
		}
		pointsRemaining -= 100;
		apiCalls++;
		path = '';
	}
	return route;
};

export { getDirections, getSnappedPoints };
