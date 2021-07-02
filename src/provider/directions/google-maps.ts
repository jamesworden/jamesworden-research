import {
	Client,
	DirectionsRoute,
	LatLngLiteralVerbose,
	SnapToRoadsResponse,
	TravelMode,
} from '@googlemaps/google-maps-services-js';
import { Directions, DirectionsProvider } from '.';
import { FunctionResponse, HttpStatusCode, coordinateUtils } from '../../util';

import { DirectionsResponse } from '@googlemaps/google-maps-services-js/dist/directions';
import { MAX_POINTS_PER_ROUTE } from '../../config';
import { decode } from 'polyline';

/**
 * TODO: split this class into the directions provider and incremental point creator from directions
 *
 * Ideally, many different API's can return directions that we can get incremental coordiante arrays from
 * This method for getting incremental points is too connected to Google Maps API
 */
class GoogleMaps implements DirectionsProvider {
	readonly apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string;
	private client: Client = new Client();

	async getDirections(
		origin: string,
		destination: string,
		waypoints: LatLngLiteralVerbose[],
		increment: number
	): Promise<FunctionResponse<Directions>> {
		const response: DirectionsResponse = await this.client.directions({
			params: {
				origin,
				destination,
				waypoints,
				key: this.apiKey,
				mode: TravelMode.driving,
			},
		});

		const responseStatus: string = response.data.status;

		if (responseStatus != 'OK') {
			if (responseStatus == 'NOT_FOUND' || responseStatus == 'ZERO_RESULTS') {
				return {
					error: true,
					httpResponse: {
						error: 'The specified directions could not be found!',
					},
					httpStatusCode: HttpStatusCode.NOT_FOUND,
				};
			}

			// TODO: add logging function for when the status is INTERNAL ERROR
			return {
				error: true,
				httpResponse: {
					error: 'Error fetching data from Google.',
				},
				httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
			};
		}

		const route: DirectionsRoute = response.data.routes[0];
		const encodedPolyline: string = route.overview_polyline.points;
		const distance = this.getDistance(route);

		const numPoints = distance / increment;

		if (numPoints > MAX_POINTS_PER_ROUTE) {
			return {
				httpResponse: {
					error: `There were too many points for this route! Your route: ${numPoints}, max: ${MAX_POINTS_PER_ROUTE} `,
				},
				error: true,
				httpStatusCode: HttpStatusCode.NOT_ACCEPTABLE,
			};
		}

		const decodedCoodrinates: number[][] = decode(encodedPolyline);

		const decodedLatLngCoords: LatLngLiteralVerbose[] =
			coordinateUtils.numToLatLng(decodedCoodrinates);

		const incrementalCoordinates = coordinateUtils.getIncrementalCoordinates(
			decodedLatLngCoords,
			increment
		);

		const snappedIncrementalCoordinates = await this.getSnappedCoordinates(
			incrementalCoordinates
		);

		return {
			httpResponse: {
				coordinates: snappedIncrementalCoordinates,
				distance,
			},
			error: false,
			httpStatusCode: HttpStatusCode.OK,
		};
	}

	private async getSnappedCoordinates(
		coordinates: LatLngLiteralVerbose[]
	): Promise<LatLngLiteralVerbose[]> {
		return await this.client
			.snapToRoads({
				params: {
					path: coordinates,
					key: this.apiKey,
				},
			})
			.then((response: SnapToRoadsResponse) => {
				let coordinates: LatLngLiteralVerbose[] = [];

				response.data.snappedPoints.forEach((snappedPoint) => {
					coordinates.push(snappedPoint.location);
				});

				return coordinates;
			});
	}

	private getDistance(route: DirectionsRoute): number {
		let distance = 0;

		route.legs.forEach((leg) => {
			if (leg.distance && leg.distance.value) {
				distance += leg.distance.value;
			}
		});

		return distance;
	}
}

export const googleMaps = new GoogleMaps();
