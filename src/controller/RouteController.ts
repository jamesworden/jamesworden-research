import {Response, Status} from 'src/util/Status'
import {WaypointData, parser} from 'src/util/Parser'
import express, {Response as ExpressResponse, Request} from 'express'

import {DEFAULT_INCREMENT_DISTANCE} from '../config/Constants'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {RouteData} from 'src/model/RouteFactory'
import {RouteOption} from '../model/Route'
import {app} from 'src'
import {validation} from '../util/Validation'

const routes = express.Router({mergeParams: true})

routes.get('/', async function (req: Request, res: ExpressResponse) {
  const sample: string = req.query.sample as string

  if (validation.equalsTrue(sample)) {
    res.status(200).send({route: require('../json/sampleRoute.json')})
    return
  }

  const key: string = req.query.key as string,
    origin: string = req.query.origin as string,
    destination: string = req.query.destination as string,
    panoramaId: boolean = validation.equalsTrue(req.query.panoid as string),
    panoramaText: boolean = validation.equalsTrue(req.query.panotext as string),
    waypointString: string = req.query.waypoints as string,
    increment: number = req.query.increment
      ? parseInt(req.query.increment as string)
      : DEFAULT_INCREMENT_DISTANCE

  if (validation.containsInvalidKey(key, res)) return
  if (validation.containsUndefinedValues({origin, destination}, res)) return

  const options: RouteOption[] = []
  if (panoramaId) options.push(RouteOption.PANORAMA_ID)
  if (panoramaText) options.push(RouteOption.PANORAMA_TEXT)

  const wRes: Response<WaypointData> =
    parser.parseWaypointString(waypointString)

  /**
   * Todo: Send the actual reason there was an error
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
    waypoints,
    options
  )

  /**
   * Todo: send more informative response
   *
   * Todo: break controller up from service - this class should send some
   * sort of response type to the actual mechanism that SENDS the HTTP response
   * back to the user
   */
  if (rRes.status != Status.OK || !rRes.data) {
    res.status(200).send({
      error: 'There was an error fetching the desired route',
      status: Status.INTERNAL_ERROR
    })
  }

  /**
   * Todo: make the status code dynamic according to a new Status class.
   *
   * This class should have 3 properties:
   *   string: enumerated identifier, ex: 'INTERNAL_ERROR'
   *   string: human readable message, ex: 'Error processing your request.'
   *   number: status code, ex: 500
   *
   * This way, we could send the response easily without a wrapper or adapter
   * to make it work with Express. Make there's an express type for this?
   */
  res.status(200).send(rRes)
})

export default routes
