import * as Validation from '../util/Validation'

import {Request, Response} from 'express'

import express from 'express'

const routes = express.Router({mergeParams: true})

routes.get('/', async function (req: Request, res: Response) {
  const key: string = req.query.key as string,
    location: string = req.query.origin as string

  if (Validation.containsInvalidKey(key, res)) return
  if (Validation.containsUndefinedValues({location}, res)) return

  res.render('Image', {
    location
  })
})

export default routes
