import * as Calculations from '../util/Calculations';
import * as GoogleCloudVision from '../util/google/GoogleCloudVision';
import * as GoogleMaps from '../util/google/GoogleMaps';
import * as GoogleStreetView from '../util/google/GoogleStreetView';

import Point from '../model/Point';
import { RouteOption } from './RouteOption';
import { Status } from './Status';
import constants from '../config/Constants';

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
	async build(options: RouteOption[]): Promise<this> {
		this.status = Status.OK;
		var data = await GoogleMaps.getDirections(this.origin, this.destination, this.waypoints);
		if (data.status != 'OK') {
			if (data.status == 'NOT_FOUND') this.status = Status.ROUTE_NOT_FOUND;
			else this.status = Status.INTERNAL_ERROR;
			return this;
		}
		this.distance = await Calculations.getDistanceFromLegs(data.routes[0]['legs']);
		if (this.distance > constants.MAX_ROUTE_DISTANCE) {
			this.status = Status.EXCEEDED_MAXIMUM_DISTANCE;
			return this;
		}
		var points: Point[] = Calculations.getPointsFromEncodedPolyline(
			data['routes'][0]['overview_polyline']['points'],
			this.increment
		);
		if (points.length <= 0) {
			this.status = Status.INTERNAL_ERROR;
			return this;
		}
		this.points = await GoogleMaps.getSnappedPoints(points);
		if (this.points.length <= 0) {
			this.status = Status.INTERNAL_ERROR;
		}
		if (options.length <= 0) {
			return this;
		}
		var optionPromises: Promise<any>[] = [];
		this.points.forEach((point) => {
			if (options.includes(RouteOption.PANORAMA_ID)) {
				optionPromises.push(
					GoogleStreetView.getPanoramaId(point).then((pano_id: string) => {
						point.setPanoramaId(pano_id);
					})
				);
			}
			if (options.includes(RouteOption.PANORAMA_TEXT)) {
				// Gather text from three different images to simulate a panorama image
				for (let heading = 0; heading < 360; heading += 120) {
					optionPromises.push(
						GoogleStreetView.getPanoramaBase64(point, heading)
							.then((base64) => {
								return GoogleCloudVision.getTextFromBase64(base64);
							})
							.then((textArray) => {
								point.addPanoramaText(textArray);
							})
					);
				}
			}
		});
		await Promise.all(optionPromises);
		return this;
	}

	getPoints(): Point[] {
		return this.points;
	}
}
