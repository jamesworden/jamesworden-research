import {Response, Status} from '../util/response-protocol'
import {Route, RouteOption} from '../model/route/route'
import {WaypointData, parser} from 'src/util/parser'
import express, {Response as ExpressResponse, Request} from 'express'

import {DEFAULT_INCREMENT_DISTANCE} from '../config/constants'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Report} from '../model/report/report'
import {RouteData} from 'src/model/route/route.factory'
import {app} from '../app'
import {validation} from '../util/validation'

const routes = express.Router({mergeParams: true})

routes.get('/', async function (req: Request, res: ExpressResponse) {
  const sample: string = req.query.sample as string

  if (validation.equalsIgnoreCase(sample as string, 'true')) {
    const route: Route = require('../json/sampleRoute.json'),
      detour: Route = require('../json/sampleDetour.json'),
      report: Report = new Report(route, detour)

    res.status(200).send(report)
    return
  }

  const key: string = req.query.key as string,
    origin: string = req.query.origin as string,
    destination: string = req.query.destination as string,
    waypointString: string = req.query.waypoints as string,
    increment: number = req.query.increment
      ? parseInt(req.query.increment as string)
      : DEFAULT_INCREMENT_DISTANCE

  if (validation.containsInvalidKey(key, res)) {
    return
  }

  if (
    validation.containsUndefinedValues(
      {origin, destination, waypointString},
      res
    )
  ) {
    return
  }

  const wRes: Response<WaypointData> =
    parser.parseWaypointString(waypointString)

  /**
   * TODO: Send the actual reason there was an error
   */
  if (wRes.status != Status.OK || !wRes.data) {
    res.status(200).send({
      error: 'There was an error fetching the waypoints!',
      status: Status.INTERNAL_ERROR
    })
  }

  const waypoints: LatLngLiteralVerbose[] = wRes.data!.waypoints

  const rRes: Response<RouteData> = await app.routeFactory.createRoute(
    origin,
    destination,
    increment,
    [],
    [RouteOption.PANORAMA_TEXT]
  )

  const dRes: Response<RouteData> = await app.routeFactory.createRoute(
    origin,
    destination,
    increment,
    waypoints,
    [RouteOption.PANORAMA_TEXT]
  )

  if (!rRes.data || !dRes.data) {
    res.status(202).send({
      error: 'Route or detour data invalid!',
      status: Status.INTERNAL_ERROR
    })
  }

  res.status(200).send(new Report(rRes.data!.route, dRes.data!.route))
})

export default routes
