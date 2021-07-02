import { CoordinateData, FunctionResponse, QueryValidatior, parser, validation } from '../util';
import { Option, Report, Route, RouteData } from '../model';
import { Request, Response, Router } from 'express';
import { sampleDetour, sampleRoute } from '../json';

import { DEFAULT_INCREMENT_DISTANCE } from '../config';
import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { app } from '../app';

const reportRoutes: Router = Router({ mergeParams: true });

reportRoutes.get('/', async function (req: Request, res: Response) {
	const sample: string = req.query.sample as string;

	if (validation.equalsIgnoreCase(sample as string, 'true')) {
		const route = sampleRoute;
		const detour = sampleDetour;
		const report: Report = new Report(route, detour);

		res.status(200).send(report);
		return;
	}

	const key: string = req.query.key as string;
	const origin: string = req.query.origin as string;
	const destination: string = req.query.destination as string;
	const waypointString: string = req.query.waypoints as string;
	const increment: number = req.query.increment
		? parseInt(req.query.increment as string)
		: DEFAULT_INCREMENT_DISTANCE;

	const queryValidator = new QueryValidatior(res);
	if (queryValidator.containsUndefinedValues({ origin, destination, waypointString })) return;
	if (queryValidator.containsInvalidKey(key)) return;

	const coordinateData: FunctionResponse<CoordinateData> =
		parser.parseCoordinateString(waypointString);

	if (coordinateData.error) {
		res.status(coordinateData.httpStatusCode).send(coordinateData.httpResponse);
		return;
	}

	const waypoints: LatLngLiteralVerbose[] = coordinateData.httpResponse.coordinates;

	const routeData: FunctionResponse<RouteData> = await app.routeFactory.createRoute(
		origin,
		destination,
		increment,
		[],
		[Option.PANORAMA_TEXT]
	);

	const detourData: FunctionResponse<RouteData> = await app.routeFactory.createRoute(
		origin,
		destination,
		increment,
		waypoints,
		[Option.PANORAMA_TEXT]
	);

	if (routeData.error) {
		res.status(routeData.httpStatusCode).send(routeData.httpResponse);
		return;
	}

	if (detourData.error) {
		res.status(detourData.httpStatusCode).send(detourData.httpResponse);
		return;
	}

	const route: Route = routeData.httpResponse.route;
	const detour: Route = detourData.httpResponse.route;

	const report: Report = new Report(route, detour);

	res.status(200).send(report);
});

export { reportRoutes };
