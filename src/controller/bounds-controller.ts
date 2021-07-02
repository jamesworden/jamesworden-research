import { CoordinateData, FunctionResponse, QueryValidatior, parser } from '../util';
import { Request, Response, Router } from 'express';

import { Bounds } from '../model';
import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js';

const boundsRoutes: Router = Router({ mergeParams: true });

boundsRoutes.get('/', async function (req: Request, res: Response) {
	const topLeft = req.query.topleft as string;
	const key = req.query.key as string;

	const queryValidator = new QueryValidatior(res);
	if (queryValidator.containsUndefinedValues({ topLeft })) return;
	if (queryValidator.containsInvalidKey(key)) return;

	const coordsRes: FunctionResponse<CoordinateData> = parser.parseCoordinateString(topLeft);

	if (coordsRes.error) {
		res.status(coordsRes.httpStatusCode).send(coordsRes.httpResponse);
		return;
	}

	const topLeftCoordinates: LatLngLiteralVerbose = coordsRes.httpResponse.coordinates[0];
	const bounds: Bounds = new Bounds(topLeftCoordinates);

	res.status(200).send(bounds);
});

export { boundsRoutes };
