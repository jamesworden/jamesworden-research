import * as Validation from '../util/Validation'

import {Request, Response} from 'express'
import {Route, RouteOption} from '../model/Route'
import {RouteFactoryResponse, RouteFactoryStatus} from 'src/model/RouteFactory'
import {
  WaypointStringResponse,
  WaypointStringStatus,
  parser
} from 'src/util/Parser'

import {DEFAULT_INCREMENT_DISTANCE} from '../config/Constants'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from 'src'
import express from 'express'

const routes = express.Router({mergeParams: true})

routes.get('/', async function (req: Request, res: Response) {
  const sample: string = req.query.sample as string

  if (Validation.equalsIgnoreCase(sample, 'true')) {
    res.status(200).send({route: require('../json/sampleRoute.json')})
    return
  }

  const key: string = req.query.key as string,
    origin: string = req.query.origin as string,
    destination: string = req.query.destination as string,
    panoramaId: boolean = Validation.equalsTrue(req.query.panoid as string),
    panoramaText: boolean = Validation.equalsTrue(req.query.panotext as string),
    waypointString: string = req.query.waypoints as string,
    increment: number = req.query.increment
      ? parseInt(req.query.increment as string)
      : DEFAULT_INCREMENT_DISTANCE

  if (Validation.containsInvalidKey(key, res)) return
  if (Validation.containsUndefinedValues({origin, destination}, res)) return

  const options: RouteOption[] = []
  if (panoramaId) options.push(RouteOption.PANORAMA_ID)
  if (panoramaText) options.push(RouteOption.PANORAMA_TEXT)

  const wRes: WaypointStringResponse =
    parser.parseWaypointString(waypointString)

  if (wRes.status != WaypointStringStatus.OK || !wRes.data) {
    res.status(200).send({status: wRes.status})
  }

  const waypoints: LatLngLiteralVerbose[] = wRes.data!.waypoints

  const rRes: RouteFactoryResponse = await app.routeFactory.createRoute(
    origin,
    destination,
    increment,
    waypoints,
    options
  )

  if (rRes.status != RouteFactoryStatus.OK || !rRes.data) {
    res.status(200).send({status: rRes.status})
  }

  res.status(200).send(rRes.data!.route)
})

export default routes
