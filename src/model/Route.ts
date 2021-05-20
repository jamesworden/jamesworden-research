import * as calculations from '../util/Calculations';

import Point from '../model/Point';
import { Status } from './Status';
import axios from 'axios';
import constants from '../config/Constants';
import { decode } from 'polyline';

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
	/* Create the route and inject it into the 'route' member variable */
	async initialize(panoramaText: boolean = false, panoramaId: boolean = false): Promise<this> {
		/* Fetch route from Google Directions */
		let key = process.env.GOOGLE_MAPS_BACKEND_KEY,
			url = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.origin}
			&destination=${this.destination}&key=${key}&waypoints=${this.waypoints}`,
			response = await axios.get(url),
			data = response.data,
			status = data.status;
		if (status != 'OK') {
			if (status == 'NOT_FOUND') this.status = Status.ROUTE_NOT_FOUND;
			else status = Status.INTERNAL_ERROR;
			return this;
		}
		/* Ensure route is not too long */
		let legs = data.routes[0]['legs'];
		this.distance = 0;
		for (let leg of legs) this.distance += leg['distance']['value'];
		if (this.distance > constants.MAX_ROUTE_DISTANCE) {
			this.status = Status.EXCEEDED_MAXIMUM_DISTANCE;
			return this;
		}
		/* Create and push valid points from polyline */
		let points = decode(data.routes[0].overview_polyline.points),
			validPoints: Point[] = [],
			currentPoint = points[0], // Temporary marker
			distanceUntilNextPoint = 0, // Starts at 0 because 1st point should be added immediately
			i = 0;
		while (i < points.length) {
			currentPoint = new Point(points[i][0], points[i][1]);
			let nextPoint = new Point(points[i + 1][0], points[i + 1][0]);
			let distanceBetweenPoints = calculations.getDistanceBetweenPoints(
				currentPoint,
				nextPoint
			);
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
				distanceUntilNextPoint = this.increment; // Point added, reset distance
			}
		}
		/* Google's 'Snap to Roads' API only takes 100 points per API call. */
		let pointsRemaining = validPoints.length, // Make API call every 100 points
			route: Point[] = [],
			apiCalls: number = 0,
			path: string = '';
		while (pointsRemaining > 0) {
			// Beginning and end indexes for points in route array
			let minRouteIndex: number = apiCalls * 100, // 100 slots for each call that has already been made
				maxRouteIndex: number = minRouteIndex + 100; // 100 more than the minimum
			for (i = minRouteIndex; i < maxRouteIndex; i++) {
				let currentPoint = validPoints[i];
				if (currentPoint == undefined) break; // End loop if there is no current point
				path += currentPoint[0] + ',' + currentPoint[1] + '|'; // Add current point coordinates to path string
			}
			path = path.slice(0, -1);
			let url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`,
				response = await axios.get(url),
				snappedPoints = response.data.snappedPoints;
			if (snappedPoints == undefined) {
				this.status = Status.INTERNAL_ERROR;
				return this;
			}
			// Loop through all snapped points and add them to corrected route array
			for (i = 0; i < snappedPoints.length; i++) {
				let p = snappedPoints[i]['location'];
				route.push(new Point(p['latitude'], p['longitude']));
			}
			pointsRemaining -= 100;
			apiCalls++;
			path = '';
		}
		/* Corrected Route has been created. Add additional query data for each coordinate pair */
		if (panoramaId || panoramaText) {
			let promises: Promise<any>[] = [];
			const { getPanoramaId, getPanoramaText } = require('./panorama'),
				vision = require('@google-cloud/vision'),
				client = new vision.ImageAnnotatorClient();
			// Loop through all coordinate pairs and push promises for each location
			for (i = 0; i < route.length; i++) {
				(function (i) {
					let p = route[i]['location'],
						point = new Point(p['latitude'], p['longitude']);
					if (panoramaId) {
						promises.push(
							getPanoramaId(point).then((pano_id: string) => {
								point.setPanoramaId(pano_id);
							})
						);
					}
					if (panoramaText) {
						route[i]['pano_text'] = '';
						for (let heading = 0; heading < 360; heading += 120) {
							promises.push(
								getPanoramaText(point, client, heading).then((pano_text) => {
									route[i]['pano_text'] += pano_text + ',';
								})
							);
						}
					}
				})(i);
			}
			await Promise.all(promises);
		}
		return this;
	}
}
