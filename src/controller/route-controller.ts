import { CoordinateData, FunctionResponse, QueryValidatior, parser, validation } from '../util';
import { Option, RouteData } from '../model';
import { Request, Response, Router } from 'express';

import { DEFAULT_INCREMENT_DISTANCE } from '../config';
import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';
import { app } from '../app';
import { sampleRoute } from '../json';

const routeRoutes: Router = Router({ mergeParams: true });

routeRoutes.get('/', async function (req: Request, res: Response) {
	const sample: string = req.query.sample as string;

	if (validation.equalsTrue(sample)) {
		res.status(200).send({ route: sampleRoute });
		return;
	}

	const key: string = req.query.key as string;
	const origin: string = req.query.origin as string;
	const destination: string = req.query.destination as string;
	const panoramaId: boolean = validation.equalsTrue(req.query.panoid as string);
	const panoramaText: boolean = validation.equalsTrue(req.query.panotext as string);
	const waypointString: string = req.query.waypoints as string;
	const increment: number = req.query.increment
		? parseInt(req.query.increment as string)
		: DEFAULT_INCREMENT_DISTANCE;

	const queryValidator = new QueryValidatior(res);
	if (queryValidator.containsUndefinedValues({ origin, destination })) return;
	if (queryValidator.containsInvalidKey(key)) return;

	const options: Option[] = [];

	if (panoramaId) {
		options.push(Option.PANORAMA_ID);
	}

	if (panoramaText) {
		options.push(Option.PANORAMA_TEXT);
	}

	const coordsData: FunctionResponse<CoordinateData> =
		parser.parseCoordinateString(waypointString);

	if (coordsData.error) {
		res.status(coordsData.httpStatusCode).send(coordsData.httpResponse);
		return;
	}

	const waypoints: LatLngLiteralVerbose[] = coordsData.httpResponse.coordinates;

	const routeData: FunctionResponse<RouteData> = await app.routeFactory.createRoute(
		origin,
		destination,
		increment,
		waypoints,
		options
	);

	if (routeData.error) {
		res.status(routeData.httpStatusCode).send(routeData.httpResponse);
		return;
	}

	res.status(routeData.httpStatusCode).send(routeData.httpResponse);
});

export { routeRoutes };
