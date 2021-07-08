import {
  Failure,
  QueryValidatior,
  isFailure,
  parser,
  validation
} from '../../util'
import {Option, Route} from '../../model'
import {Request, Response, Router} from 'express'

import {DEFAULT_INCREMENT_DISTANCE} from '../../config'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from '../../app'
import {sampleRoute} from '../../json'

const routeRouter: Router = Router({mergeParams: true})

routeRouter.get('/', async function (req: Request, res: Response) {
  const sample: string = req.query.sample as string

  if (validation.equalsTrue(sample)) {
    res.status(200).send({route: sampleRoute})
    return
  }

  const key: string = req.query.key as string
  const origin: string = req.query.origin as string
  const destination: string = req.query.destination as string
  const panoramaId: boolean = validation.equalsTrue(req.query.panoid as string)
  const panoramaText: boolean = validation.equalsTrue(
    req.query.panotext as string
  )
  const waypointString: string = req.query.waypoints as string
  const increment: number = req.query.increment
    ? parseInt(req.query.increment as string)
    : DEFAULT_INCREMENT_DISTANCE

  const queryValidator = new QueryValidatior(res)
  if (queryValidator.containsInvalidKey(key)) return
  if (queryValidator.containsUndefinedValues({origin, destination})) return

  const options: Option[] = []

  if (panoramaId) {
    options.push(Option.PANORAMA_ID)
  }

  if (panoramaText) {
    options.push(Option.PANORAMA_TEXT)
  }

  let waypoints: LatLngLiteralVerbose[] = []

  if (waypointString) {
    const locationsRes: LatLngLiteralVerbose[] | Failure =
      parser.getLocationsFromString(waypointString)

    if (isFailure(locationsRes)) {
      res.status(locationsRes.statusCode).send(locationsRes.response)
      return
    }
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
