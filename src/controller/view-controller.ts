import { Request, Response } from 'express';

import express from 'express';

const viewRoutes = express.Router({ mergeParams: true });

viewRoutes.get('/', async function (_req: Request, res: Response) {
	res.render('Home');
});

viewRoutes.get('/docs', async function (_req: Request, res: Response) {
	res.render('Docs');
});

export { viewRoutes };
