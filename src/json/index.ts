import { Route } from '../model';
import directionsResponseDataJSON from './DirectionsResponseData.json';
import sampleDetourJSON from './sampleDetour.json';
import sampleRouteJSON from './sampleRoute.json';

export const sampleRoute = new Route(
	sampleRouteJSON.origin,
	sampleRouteJSON.destination,
	sampleRouteJSON.points,
	sampleRouteJSON.increment,
	sampleRouteJSON.distance
);

export const sampleDetour = new Route(
	sampleDetourJSON.origin,
	sampleDetourJSON.destination,
	sampleDetourJSON.points,
	sampleDetourJSON.increment,
	sampleDetourJSON.distance
);
