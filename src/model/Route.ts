import * as calculations from '../util/Calculations';

import { getPanoramaId, getPanoramaText } from './Panorama';

import Point from '../model/Point';
import { Status } from './Status';
import axios from 'axios';
import constants from '../config/Constants';
import { decode } from 'polyline';
import vision from '@google-cloud/vision';

export default class Route {
	origin: string;
	destination: string;
	increment: number;
	waypoints: string;
	status: Status;
	distance: number;
	points: Point[];

	constructor(origin: string, destination: string, increment: number, waypoints: string = '') {
		this.origin = origin;
		this.destination = destination;
		this.increment = increment;
		this.waypoints = waypoints;
		this.status = Status.NOT_INITALIZED;
		this.points = [];
	}

	/**
	 * Create the route and inject it into the 'route' member variable
	 */
	async initialize(): Promise<this> {
		let data = await fetchGoogleDirections(this.origin, this.destination, this.waypoints);
		if (data.status != 'OK') {
			if (data.status == 'NOT_FOUND') this.status = Status.ROUTE_NOT_FOUND;
			else this.status = Status.INTERNAL_ERROR;
			return this;
		}
		this.distance = await getDistanceFromLegs(data.routes[0]['legs']);
		if (this.distance > constants.MAX_ROUTE_DISTANCE) {
			this.status = Status.EXCEEDED_MAXIMUM_DISTANCE;
			return this;
		}
		let points = getPointsFromPolyline(data.routes[0].overview_polyline, this.increment);
		if (points.length <= 0) {
			this.status = Status.INTERNAL_ERROR;
			return this;
		}
		let route = await snapPointsToRoad(points);
		if (route.length <= 0) this.status = Status.INTERNAL_ERROR;
		return this;
	}

	/**
	 * Add query parameters to route data
	 */
	async addParameters(panoramaId: boolean, panoramaText: boolean): Promise<this> {
		if (!panoramaId && !panoramaText) return this;
		let promises: Promise<any>[] = [],
			client = new vision.ImageAnnotatorClient();
		console.log(this.points);
		// for (let i = 0; i < this.points.length; i++) {
		// 	(function (i) {
		// 		let p = this.points[i]['location'],
		// 			point = new Point(p['latitude'], p['longitude']);
		// 		if (panoramaId) {
		// 			promises.push(
		// 				getPanoramaId(point).then((pano_id: string) => {
		// 					point.setPanoramaId(pano_id);
		// 				})
		// 			);
		// 		}
		// 		if (panoramaText) {
		// 			this.points[i]['pano_text'] = '';
		// 			for (let heading = 0; heading < 360; heading += 120) {
		// 				promises.push(
		// 					getPanoramaText(point, client, heading).then((pano_text) => {
		// 						this.point[i]['pano_text'] += pano_text + ',';
		// 					})
		// 				);
		// 			}
		// 		}
		// 	})(i);
		// }
		await Promise.all(promises);
		return this;
	}
}

let fetchGoogleDirections = async (
	origin: string,
	destination: string,
	waypoints: string
): Promise<any> => {
	let key = process.env.GOOGLE_MAPS_BACKEND_KEY,
		url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&waypoints=${waypoints}`,
		response = await axios.get(url);
	return response.data;
};

let getDistanceFromLegs = async (legs: any[]): Promise<number> => {
	let distance = 0;
	for (let leg of legs) distance += leg['distance']['value'];
	return distance;
};

let getPointsFromPolyline = (polyline: any, increment: number): Point[] => {
	let points = decode(polyline.points),
		validPoints: Point[] = [],
		currentPoint = points[0], // Temporary marker
		distanceUntilNextPoint = 0, // Starts at 0 because 1st point should be added immediately
		i = 0;
	while (i < points.length) {
		currentPoint = new Point(points[i][0], points[i][1]);
		let nextPoint = new Point(points[i + 1][0], points[i + 1][0]);
		let distanceBetweenPoints = calculations.getDistanceBetweenPoints(currentPoint, nextPoint);
		if (distanceBetweenPoints < distanceUntilNextPoint) {
			distanceUntilNextPoint -= distanceBetweenPoints;
			currentPoint = points[i + 1];
			i++;
		} else {
			// Incrementally create new point from current point
			let newPoint = calculations.getIntermediatePoint(
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

let snapPointsToRoad = async (points: any[]): Promise<Point[]> => {
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
			path += currentPoint[0] + ',' + currentPoint[1] + '|'; // Add current point coordinates to path string
		}
		path = path.slice(0, -1);
		let key = process.env.GOOGLE_MAPS_BACKEND_KEY,
			url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`,
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
