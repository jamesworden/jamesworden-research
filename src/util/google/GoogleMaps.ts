import Point from '../../model/Point';
import axios from 'axios';

const key = process.env.GOOGLE_MAPS_BACKEND_KEY;

type DirectionsResponse = {
	result: google.maps.DirectionsResult | null;
	status: google.maps.DirectionsStatus;
};

/**
 * Get directions from Google Maps
 * @param {String} origin
 * @param {String} destination
 * @param {google.maps.DirectionsWaypoint[]} waypoints
 * @return {Promise<DirectionsResponse>}
 */
const getDirections = async (
	origin: string,
	destination: string,
	waypoints: google.maps.DirectionsWaypoint[]
): Promise<DirectionsResponse> => {
	const options = {
		origin,
		destination,
		waypoints,
		travelMode: google.maps.TravelMode.DRIVING,
	};
	let response: DirectionsResponse = {
		result: null,
		status: google.maps.DirectionsStatus.UNKNOWN_ERROR,
	};
	await new google.maps.DirectionsService().route(
		options,
		(result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
			response = {
				result,
				status,
			};
		}
	);
	return response;
};

/**
 * @param waypointString A string containing addresses and cooridinate pairs using '|' characters
 * as separators. Example: 'address 1|40.4323235r3,-70.4342543534|address 3...'
 */
const getWaypoints = (waypointString: String): google.maps.DirectionsWaypoint[] => {
	let waypoints: google.maps.DirectionsWaypoint[] = [];
	let array = waypointString.split('|');
	array.forEach((string: string) => {
		waypoints.push({
			location: string,
			stopover: true,
		});
	});
	return waypoints;
};

/**
 * Get snapped points from Google
 * @param {Point[]} points
 * @returns Promise returning an array of snapped points
 */
const getSnappedPoints = async (points: Point[]): Promise<Point[]> => {
	let pointsRemaining = points.length, // Make API call every 100 points
		route: Point[] = [],
		apiCalls: number = 0,
		path: string = '';
	while (pointsRemaining > 0) {
		// Beginning and end indexes for points in route array
		const minRouteIndex: number = apiCalls * 100, // 100 slots for each call that has already been made
			maxRouteIndex: number = minRouteIndex + 100; // 100 more than the minimum
		for (let i = minRouteIndex; i < maxRouteIndex; i++) {
			const currentPoint = points[i];
			if (currentPoint == undefined) break; // End loop if there is no current point
			path += currentPoint.getLatitude() + ',' + currentPoint.getLongitude() + '|'; // Add current point coordinates to path string
		}
		path = path.slice(0, -1);
		const url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`,
			response = await axios.get(url),
			snappedPoints = response.data.snappedPoints;
		if (snappedPoints == undefined) return [];
		// Loop through all snapped points and add them to corrected route array
		for (let i = 0; i < snappedPoints.length; i++) {
			const p = snappedPoints[i].location;
			route.push(new Point(p.latitude, p.longitude));
		}
		pointsRemaining -= 100;
		apiCalls++;
		path = '';
	}
	return route;
};

export { getDirections, getSnappedPoints, getWaypoints, DirectionsResponse };
