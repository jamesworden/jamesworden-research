import {
  Failure,
  QueryValidator,
  isFailure,
  parser,
  validation
} from '../../util'
import {Option, Point, getOptions} from '../../model'
import {Request, Response, Router} from 'express'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {app} from '../../app'
import {samplePoint} from '../../json'

const pointRouter: Router = Router({mergeParams: true})

pointRouter.get('/', async (req: Request, res: Response) => {
  /**
   * Is Sample
   */
  const sample: string = req.query.sample as string

  if (validation.equalsTrue(sample)) {
    res.status(200).send(samplePoint)
    return
  }
  /**
   * Get params
   */
  const key: string = req.query.key as string
  const location: string = req.query.location as string
  const panoramaId: boolean = validation.equalsTrue(
    req.query.panoramaId as string
  )
  const panoramaText: boolean = validation.equalsTrue(
    req.query.panoramaText as string
  )
  /**
   * Validate
   */
  const queryValidator = new QueryValidator(res)
  if (queryValidator.containsInvalidKey(key)) return
  if (queryValidator.containsUndefinedValues({location})) return
  /**
   * Build and return
   */
  const options: Option[] = getOptions(panoramaId, panoramaText)

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
