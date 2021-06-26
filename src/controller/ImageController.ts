import {Request, Response} from 'express'

import express from 'express'
import {validation} from '../util/Validation'

const routes = express.Router({mergeParams: true})

routes.get('/', async function (req: Request, res: Response) {
  const key: string = req.query.key as string,
    location: string = req.query.origin as string

  if (validation.containsInvalidKey(key, res)) return
  if (validation.containsUndefinedValues({location}, res)) return

  res.render('Image', {
    location
  })
})

export default routes
