import {Request, Response} from 'express'

import express from 'express'

const routes = express.Router({mergeParams: true})

routes.get('/', async function (_req: Request, res: Response) {
  res.render('Home')
})

routes.get('/docs', async function (_req: Request, res: Response) {
  res.render('Docs')
})

export default routes
