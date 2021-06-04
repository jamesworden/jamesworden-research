import { Request, Response } from 'express';

let express = require('express');
let routes = express.Router({ mergeParams: true });

routes.get('/', async function (_req: Request, res: Response) {
	res.render('index', { msg: 'Updating for Typescript and React support...' });
});

export default routes;
