import {Failure, QueryValidatior, isFailure, parser} from '../../util'
import {Option, Point} from '../../model'
import {Request, Response, Router} from 'express'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from '../../app'

const pointRouter: Router = Router({mergeParams: true})

pointRouter.get('/', async (req: Request, res: Response) => {
  const key: string = req.query.key as string
  const location: string = req.query.location as string
  const panoramaId: string = req.query.panoramaId as string
  const panoramaText: string = req.query.panoramaText as string

  const queryValidator = new QueryValidatior(res)
  if (queryValidator.containsInvalidKey(key)) return
  if (queryValidator.containsUndefinedValues({location})) return

  const options: Option[] = []

  if (panoramaId) {
    options.push(Option.PANORAMA_ID)
  }

  if (panoramaText) {
    options.push(Option.PANORAMA_TEXT)
  }

  const locationRes: Failure | LatLngLiteralVerbose =
    parser.getLocationFromString(location)

  if (isFailure(locationRes)) {
    res.status(locationRes.statusCode).send(locationRes.response)
    return
  }

  const pointRes: Failure | Point = await app.pointFactory.createPoint(
    locationRes,
    options
  )

  if (isFailure(pointRes)) {
    res.status(pointRes.statusCode).send(pointRes.response)
    return
  }

  res.send(pointRes)
})

export {pointRouter}
