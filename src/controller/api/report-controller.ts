import {
  Failure,
  QueryValidator,
  isFailure,
  parser,
  validation
} from '../../util'
import {Option, Report, Route} from '../../model'
import {Request, Response, Router} from 'express'

import {DEFAULT_INCREMENT_DISTANCE} from '../../config'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from '../../app'
import {sampleReport} from '../../json'

const reportRouter: Router = Router({mergeParams: true})

reportRouter.get('/', async function (req: Request, res: Response) {
  /**
   * TODO: Is Sample
   */
  const sample: string = req.query.sample as string

  if (validation.equalsIgnoreCase(sample as string, 'true')) {
    res.status(200).send(sampleReport)
    return
  }
  /**
   * Get params
   */
  const key: string = req.query.key as string
  const origin: string = req.query.origin as string
  const destination: string = req.query.destination as string
  const waypoints: string = req.query.waypoints as string
  const increment: number = req.query.increment
    ? parseInt(req.query.increment as string)
    : DEFAULT_INCREMENT_DISTANCE
  /**
   * Validate
   */
  const queryValidator = new QueryValidator(res)
  if (queryValidator.containsInvalidKey(key)) return
  if (
    queryValidator.containsUndefinedValues({
      origin,
      destination,
      waypoints
    })
  ) {
    return
  }
  /**
   * Build and return
   */
  const locationsRes: Failure | LatLngLiteralVerbose[] =
    parser.getLocationsFromString(waypoints)

  if (isFailure(locationsRes)) {
    res.status(locationsRes.statusCode).send(locationsRes.response)
    return
  }

  const waypointArray: LatLngLiteralVerbose[] = locationsRes

  const routeRes: Route | Failure = await app.routeFactory.createRoute(
    origin,
    destination,
    increment,
    [],
    [Option.PANORAMA_TEXT]
  )

  if (isFailure(routeRes)) {
    res.status(routeRes.statusCode).send(routeRes.response)
    return
  }

  const detourRes: Route | Failure = await app.routeFactory.createRoute(
    origin,
    destination,
    increment,
    waypointArray,
    [Option.PANORAMA_TEXT]
  )

  if (isFailure(detourRes)) {
    res.status(detourRes.statusCode).send(detourRes.response)
    return
  }

  const route: Route = routeRes
  const detour: Route = detourRes

  const report: Report = new Report(route, detour)

  res.status(200).send(report)
})

export {reportRouter}
