import { Request, Response, Router } from 'express';

import { QueryValidatior } from '../util';

const imageRoutes: Router = Router({ mergeParams: true });

/**
 * TODO: totally not functional. Need to pass in google street view image
 * or have a panorama image provider here.
 */
imageRoutes.get('/', async function (req: Request, res: Response) {
	const key: string = req.query.key as string;
	const location: string = req.query.origin as string;

	const queryValidator = new QueryValidatior(res);
	if (queryValidator.containsUndefinedValues({ location })) return;
	if (queryValidator.containsInvalidKey(key)) return;

	res.render('Image', {
		location,
	});
});

export { imageRoutes };
