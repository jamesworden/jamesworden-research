import { BOUNDS_DISTANCE } from '../../config';
import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { calculations } from '../../util';

export class Bounds {
	topLeft: LatLngLiteralVerbose;
	bottomLeft: LatLngLiteralVerbose;
	topRight: LatLngLiteralVerbose;
	bottomRight: LatLngLiteralVerbose;

	constructor(topLeft: LatLngLiteralVerbose) {
		/**
		 * x|.|.
		 * .|.|.
		 * .|.|.
		 */
		this.topLeft = topLeft;

		/**
		 * o|.|.
		 * .|.|.
		 * x|.|.
		 */
		this.bottomLeft = calculations.getPointFromDistance(topLeft, BOUNDS_DISTANCE, -90);

		/**
		 * o|.|.
		 * .|.|.
		 * o|.|x
		 */
		this.bottomRight = calculations.getPointFromDistance(this.bottomLeft, BOUNDS_DISTANCE, 0);

		/**
		 * o|.|x
		 * .|.|.
		 * o|.|o
		 */
		this.topRight = calculations.getPointFromDistance(this.bottomRight, BOUNDS_DISTANCE, 90);
	}
}
