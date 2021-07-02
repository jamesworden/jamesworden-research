import { FunctionResponse, HttpStatusCode } from '..';

import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { MAX_WAYPOINTS_PER_ROUTE } from '../../config';

type CoordinateData = {
	coordinates: LatLngLiteralVerbose[];
};

class Parser {
	parseCoordinateString(input: string): FunctionResponse<CoordinateData> {
		if (!input || input.trim() === '') {
			return {
				httpResponse: {
					coordinates: [],
				},
				httpStatusCode: HttpStatusCode.OK,
				error: false,
			};
		}

		const locationStrings: string[] = input!.split('|');

		if (locationStrings.length > MAX_WAYPOINTS_PER_ROUTE) {
			return {
				error: true,
				httpResponse: {
					error: 'There were too many waypoints in your request!',
				},
				httpStatusCode: HttpStatusCode.NOT_ACCEPTABLE,
			};
		}

		let coordinates: LatLngLiteralVerbose[] = [];

		for (const locationString of locationStrings) {
			let latLng: string[] = locationString.split(',');

			if (latLng.length != 2) {
				return {
					error: true,
					httpResponse: {
						error: `Invalid waypoint format. Try this: 'latitude1,longitude1|latitude2,longitude2|...' \ninstead of '${locationString}'`,
					},
					httpStatusCode: HttpStatusCode.NOT_ACCEPTABLE,
				};
			}

			const latitude: number = parseFloat(latLng[0]);
			const longitude: number = parseFloat(latLng[1]);

			if (
				isNaN(latitude) ||
				isNaN(longitude) ||
				latitude < -90 ||
				latitude > 90 ||
				longitude < -180 ||
				longitude > 180
			) {
				return {
					error: true,
					httpResponse: {
						error: 'Invalid waypoint values. Please use valid latitude and longitude coordinates.',
					},
					httpStatusCode: HttpStatusCode.NOT_ACCEPTABLE,
				};
			}

			coordinates.push({
				latitude,
				longitude,
			});
		}

		return {
			httpResponse: {
				coordinates,
			},
			error: false,
			httpStatusCode: HttpStatusCode.OK,
		};
	}
}

const parser = new Parser();

export { parser, CoordinateData };
