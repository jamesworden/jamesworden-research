import {Failure, isFailure, parser, validation} from '../../util'
import {Option, Point, getOptions} from '../../model'
import {Request, Response, Router} from 'express'
import {sampleRegion, sampleRegionRoute} from '../../json'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {MAX_SPECIFIC_MAP_POINTS} from '../../config'
import {app} from '../../app'

const mapRouter: Router = Router({mergeParams: true})

mapRouter.get('/', async function (req: Request, res: Response) {
  const pointsString: string = req.query.points as string

  if (pointsString) {
    const locationsRes: LatLngLiteralVerbose[] | Failure =
      parser.getLocationsFromString(pointsString)

    if (isFailure(locationsRes)) {
      res.render('Map', {
        error: locationsRes.response.error,
        userInput: pointsString
      })
      return
    }

    if (locationsRes.length > MAX_SPECIFIC_MAP_POINTS) {
      res.render('Map', {
        error: `Cannot search more than ${MAX_SPECIFIC_MAP_POINTS} points!`,
        userInput: pointsString
      })

      return
    }

    const panoramaId: boolean = validation.equalsTrue(
      req.query.panoramaId as string
    )

    const panoramaText: boolean = validation.equalsTrue(
      req.query.panoramaText as string
    )

    if (panoramaText || panoramaId) {
      const key = req.query.key as string

      if (key != process.env.RESEARCH_API_KEY) {
        res.render('Map', {
          error: 'You must specific a valid API key to get extra point data!',
          userInput: pointsString
        })

        return
      }
    }

    const options: Option[] = getOptions(panoramaId, panoramaText)

    const pointsRes = await app.routeFactory.createPoints(locationsRes, options)

    if (isFailure(pointsRes)) {
      res.render('Map', {
        error: pointsRes.response.error,
        userInput: pointsString
      })
    }

    res.render('Map', {points: pointsRes, userInput: pointsString})

    return
  }

  res.render('Map', {
    route: sampleRegionRoute,
    region: sampleRegion,
    userInput: pointsString
  })
})

export {mapRouter}
