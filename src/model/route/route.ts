import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { Option } from '..';
import { Point } from '..';

class Route {
	origin: string;
	destination: string;
	distance: number;
	points: Point[];
	increment: number;
	options: Option[];
	waypoints: LatLngLiteralVerbose[];

	constructor(
		origin: string,
		destination: string,
		points: Point[],
		increment: number,
		distance: number
	) {
		this.origin = origin;
		this.destination = destination;
		this.points = points;
		this.increment = increment;
		this.distance = distance;
	}

	addOptions(options: Option[]) {
		this.options.concat(options);
	}

	addWaypoints(waypoints: LatLngLiteralVerbose[]) {
		this.waypoints.concat(waypoints);
	}

	// Created specifically for report generation
	containsPanoramaText(): boolean {
		if (!this.options) {
			return false;
		}

		return this.options.includes(Option.PANORAMA_TEXT);
	}
}

export { Route };
