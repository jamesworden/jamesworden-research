import {Request, Response} from 'express'

import {QueryValidatior} from '../util'
import express from 'express'

const viewRouter = express.Router({mergeParams: true})

viewRouter.get('/', async function (_req: Request, res: Response) {
  res.render('Home')
})

viewRouter.get('/docs', async function (_req: Request, res: Response) {
  res.render('Docs')
})

viewRouter.get('/', async function (req: Request, res: Response) {
  const key: string = req.query.key as string
  const location: string = req.query.origin as string

  const queryValidator = new QueryValidatior(res)
  if (queryValidator.containsUndefinedValues({location})) return
  if (queryValidator.containsInvalidKey(key)) return

  res.render('Image', {
    location
  })
})

export {viewRouter}
