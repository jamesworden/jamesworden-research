import { Directions, DirectionsProvider } from '../../provider';
import { FunctionError, FunctionResponse, HttpStatusCode } from '../../util';

import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { Option } from '..';
import { Point } from '..';
import { Route } from '.';
import { app } from '../../app';

type RouteData = {
	route: Route;
};

class RouteFactory {
	directionsProvider: DirectionsProvider;

	constructor(directionsProvider: DirectionsProvider) {
		this.directionsProvider = directionsProvider;
	}

	async createRoute(
		origin: string,
		destination: string,
		increment: number,
		waypoints: LatLngLiteralVerbose[],
		options: Option[]
	): Promise<FunctionResponse<RouteData>> {
		const res: FunctionResponse<Directions> = await this.directionsProvider.getDirections(
			origin,
			destination,
			waypoints,
			increment
		);

		if (res.error) {
			return res;
		}

		const directions: Directions = res.httpResponse;
		const coordinates = directions.coordinates;

		let points: Point[] = [];
		let error: FunctionError | null = null;

		const pointPromises: Promise<void>[] = [];

		for (let coordinatePair of coordinates) {
			pointPromises.push(
				app.pointFactory.createPoint(coordinatePair, options).then((res) => {
					if (res.error) {
						error = res;
					} else {
						const point: Point = res.httpResponse.point;

						points.push(point);
					}
				})
			);
		}

		Promise.all(pointPromises);

		if (error) {
			return error;
		}

		if (points.length == 0 || points.length != coordinates.length) {
			return {
				error: true,
				httpResponse: {
					error: 'Points were missing in this route!',
				},
				httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
			};
		}

		const distance = res.httpResponse.distance;

		const route = new Route(origin, destination, points, increment, distance);

		route.addWaypoints(waypoints);
		route.addOptions(options);

		return {
			httpResponse: {
				route,
			},
			error: false,
			httpStatusCode: HttpStatusCode.OK,
		};
	}
}

export { RouteFactory, RouteData };
