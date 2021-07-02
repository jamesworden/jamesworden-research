import { FunctionResponse } from '../../util';
import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';

interface DirectionsProvider {
	getDirections(
		origin: string,
		destination: string,
		waypoints: LatLngLiteralVerbose[],
		increment: number
	): Promise<FunctionResponse<Directions>>;
	readonly apiKey: string;
}

type Directions = {
	distance: number;
	coordinates: LatLngLiteralVerbose[];
};

export { DirectionsProvider, Directions };
