import * as validation from '../util/Validation'

import {Option, Route} from '../model/Route'
import {Request, Response} from 'express'

import {DEFAULT_INCREMENT_DISTANCE} from '../config/Constants'

const express = require('express')
const routes = express.Router({mergeParams: true})

routes.get('/', async function (req: Request, res: Response) {
  const sample: string = req.query.sample as string

  if (validation.equalsIgnoreCase(sample, 'true')) {
    res.status(200).send({route: require('../json/sampleRoute.json')})
    return
  }

  const key: string = req.query.key as string,
    origin: string = req.query.origin as string,
    destination: string = req.query.destination as string,
    panoramaId: boolean = validation.equalsTrue(req.query.panoid as string),
    panoramaText: boolean = validation.equalsTrue(req.query.panotext as string),
    waypoints: string = req.query.waypoints as string,
    increment: number = req.query.increment
      ? parseInt(req.query.increment as string)
      : DEFAULT_INCREMENT_DISTANCE

  if (validation.containsInvalidKey(key, res)) {
    return
  }

  if (validation.containsUndefinedValues({origin, destination}, res)) {
    return
  }

  const options: Option[] = []

  if (panoramaId) {
    options.push(Option.PANORAMA_ID)
  }

  if (panoramaText) {
    options.push(Option.PANORAMA_TEXT)
  }

  const route: Route = await new Route(
    origin,
    destination,
    increment,
    waypoints
  ).build(options)

  res.status(200).send(route)
})

export default routes
