import * as Calculations from '../util/Calculations';
import * as GoogleCloudVision from '../util/google/GoogleCloudVision';
import * as GoogleMaps from '../util/google/GoogleMaps';
import * as GoogleStreetView from '../util/google/GoogleStreetView';

import { MAX_POINTS_PER_ROUTE } from '../config/Constants';
import Point from '../model/Point';
import { RouteOption } from './RouteOption';
import { Status } from './Status';

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
		const waypoints: google.maps.DirectionsWaypoint[] = GoogleMaps.getWaypoints(this.waypoints);
		const directionsResponse: GoogleMaps.DirectionsResponse = await GoogleMaps.getDirections(
			this.origin,
			this.destination,
			waypoints
		);
		if (directionsResponse.status != 'OK' || directionsResponse.result == null) {
			if (directionsResponse.status == 'NOT_FOUND') this.status = Status.ROUTE_NOT_FOUND;
			else this.status = Status.INTERNAL_ERROR;
			return this;
		}
		this.distance = await Calculations.getDistanceFromLegs(
			directionsResponse.result.routes[0].legs
		);
		var numPoints: number = this.distance / this.increment;
		if (numPoints > MAX_POINTS_PER_ROUTE) {
			this.status = Status.EXCEEDED_MAXIMUM_DISTANCE;
			return this;
		}
		const points: Point[] = Calculations.getPointsFromEncodedPolyline(
			directionsResponse.result.routes[0].overview_polyline,
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
		const optionPromises: Promise<any>[] = [];
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
