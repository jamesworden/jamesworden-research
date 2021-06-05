import { Request, Response } from 'express';

const express = require('express');
const routes = express.Router({ mergeParams: true });

routes.get('/', async function (_req: Request, res: Response) {
	res.render('Home');
});

export default routes;
