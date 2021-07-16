import {
  Failure,
  QueryValidator,
  isFailure,
  parser,
  validation
} from '../../util'
import {Option, Route, getOptions} from '../../model'
import {Request, Response, Router} from 'express'

import {DEFAULT_INCREMENT_DISTANCE} from '../../config'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from '../../app'
import {sampleRoute} from '../../json'

const routeRouter: Router = Router({mergeParams: true})

routeRouter.get('/', async function (req: Request, res: Response) {
  /**
   * Is Sample
   */
  const sample: string = req.query.sample as string

  if (validation.equalsTrue(sample)) {
    res.status(200).send(sampleRoute)
    return
  }
  /**
   * Get params
   */
  const key: string = req.query.key as string
  const origin: string = req.query.origin as string
  const destination: string = req.query.destination as string
  const panoramaId: boolean = validation.equalsTrue(
    req.query.panoramaId as string
  )
  const panoramaText: boolean = validation.equalsTrue(
    req.query.panoramaText as string
  )
  const waypointString: string = req.query.waypoints as string
  const increment: number = req.query.increment
    ? parseInt(req.query.increment as string)
    : DEFAULT_INCREMENT_DISTANCE
  /**
   * Validate
   */
  const queryValidator = new QueryValidator(res)
  if (queryValidator.containsInvalidKey(key)) return
  if (queryValidator.containsUndefinedValues({origin, destination})) return
  /**
   * Build and return
   */
  const options: Option[] = getOptions(panoramaId, panoramaText)

  let waypoints: LatLngLiteralVerbose[] = []

  if (waypointString) {
    const waypointRes = parser.getLocationsFromString(waypointString)

    if (isFailure(waypointRes)) {
      res.status(waypointRes.statusCode).send(waypointRes.response)
      return
    }

    waypoints = waypointRes
  }

  const routeRes: Route | Failure = await app.routeFactory.createRoute(
    origin,
    destination,
    increment,
    waypoints,
    options
  )

  if (isFailure(routeRes)) {
    res.status(routeRes.statusCode).send(routeRes.response)
    return
  }

  res.send(routeRes)
})

export {routeRouter}
