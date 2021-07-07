import {
  Failure,
  QueryValidatior,
  isFailure,
  parser,
  validation
} from '../../util'
import {Option, Report, Route} from '../../model'
import {Request, Response, Router} from 'express'
import {sampleDetour, sampleRoute} from '../../json'

import {DEFAULT_INCREMENT_DISTANCE} from '../../config'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from '../../app'

const reportRouter: Router = Router({mergeParams: true})

reportRouter.get('/', async function (req: Request, res: Response) {
  const sample: string = req.query.sample as string

  if (validation.equalsIgnoreCase(sample as string, 'true')) {
    const route = sampleRoute
    const detour = sampleDetour
    const report: Report = new Report(route, detour)

    res.status(200).send(report)
    return
  }

  const key: string = req.query.key as string
  const origin: string = req.query.origin as string
  const destination: string = req.query.destination as string
  const waypointString: string = req.query.waypoints as string
  const increment: number = req.query.increment
    ? parseInt(req.query.increment as string)
    : DEFAULT_INCREMENT_DISTANCE

  const queryValidator = new QueryValidatior(res)
  if (queryValidator.containsInvalidKey(key)) return
  if (
    queryValidator.containsUndefinedValues({
      origin,
      destination,
      waypointString
    })
  )
    return

  const locationsRes: Failure | LatLngLiteralVerbose[] =
    parser.getLocationsFromString(waypointString)

  if (isFailure(locationsRes)) {
    res.status(locationsRes.statusCode).send(locationsRes.response)
    return
  }

  const waypoints: LatLngLiteralVerbose[] = locationsRes

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
    waypoints,
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
