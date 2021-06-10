import * as validation from '../util/Validation';

import { Request, Response } from 'express';

const express = require('express');
const routes = express.Router({ mergeParams: true });

routes.get('/', async function (req: Request, res: Response) {
	const key: string = req.query.key as string,
		location: string = req.query.origin as string;

	if (validation.containsInvalidKey(key, res)) return;
	if (validation.containsUndefinedValues({ location }, res)) return;

	res.render('Image', {
		location,
	});
});

export default routes;
