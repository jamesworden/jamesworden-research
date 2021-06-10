import * as validation from '../util/Validation';

import { Request, Response } from 'express';

import { DEFAULT_INCREMENT_DISTANCE } from '../config/Constants';
import Report from '../model/Report';
import Route from '../model/Route';
import { RouteOption } from '../model/RouteOption';

const express = require('express');
const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req: Request, res: Response) {
	const sample: string = req.query.sample as string;
	if (validation.equalsIgnoreCase(sample as string, 'true')) {
		const route: Route = require('../json/sampleRoute.json'),
			detour: Route = require('../json/sampleDetour.json'),
			report: Report = new Report(route, detour);
		res.status(200).send(report);
		return;
	}
	const key: string = req.query.key as string,
		origin: string = req.query.origin as string,
		destination: string = req.query.destination as string,
		waypoints: string = req.query.waypoints as string,
		increment: number =
			parseInt(req.query.increment as string) || (DEFAULT_INCREMENT_DISTANCE as number);

	if (validation.containsInvalidKey(key, res)) return;
	if (validation.containsUndefinedValues({ origin, destination, waypoints }, res)) return;
	if (validation.containsExtraWaypoints(waypoints, res)) return;

	const route: Route = await new Route(origin, destination, increment).build([
		RouteOption.PANORAMA_TEXT,
	]);
	const detour: Route = await new Route(origin, destination, increment, waypoints).build([
		RouteOption.PANORAMA_TEXT,
	]);
	res.status(200).send(new Report(route, detour));
});

export default routes;
