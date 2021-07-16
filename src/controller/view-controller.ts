import {Request, Response} from 'express'

import express from 'express'
import {sampleRoute} from '../json'

const viewRouter = express.Router({mergeParams: true})

viewRouter.get('/', async function (_req: Request, res: Response) {
  res.render('Home', {route: sampleRoute})
})

viewRouter.get('/docs', async function (_req: Request, res: Response) {
  res.render('Docs')
})

export {viewRouter}
