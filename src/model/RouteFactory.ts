import {Directions, DirectionsProvider} from 'src/provider/DirectionsProvider'
import {ExtractedText, OcrProvider} from 'src/provider/OcrProvider'
import {
  PanoramaImage,
  PanoramaImageId,
  PanoramaImageProvider
} from 'src/provider/PanoramaImageProvider'
import {Response, Status} from '../util/Status'
import {Route, RouteOption} from './Route'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Point} from './Point'

type RouteFactoryResponse = {
  data?: {
    route: Route
  }
  status: Status
}

class RouteFactory {
  directionsProvider: DirectionsProvider
  panoramaImageProvider: PanoramaImageProvider
  ocrProvider: OcrProvider

  constructor(
    directionsProvider: DirectionsProvider,
    imageProvider: PanoramaImageProvider,
    ocrProvider: OcrProvider
  ) {
    this.directionsProvider = directionsProvider
    this.panoramaImageProvider = imageProvider
    this.ocrProvider = ocrProvider
  }

  async createRoute(
    origin: string,
    destination: string,
    increment: number,
    waypoints: LatLngLiteralVerbose[],
    options: RouteOption[]
  ): Promise<Response<RouteData>> {
    const res: Response<Directions> =
      await this.directionsProvider.getDirections(
        origin,
        destination,
        waypoints,
        increment
      )

    if (res.status != Status.OK || !res.data) {
      return {
        error: 'Unable to fetch directions for the route',
        status: Status.INTERNAL_ERROR
      }
    }

    const coordinates = res.data.coordinates

    let points: Point[] = []
    const optionPromises: Promise<any>[] = []

    coordinates.forEach((coordinatePair: LatLngLiteralVerbose) => {
      const lat = coordinatePair.latitude
      const lng = coordinatePair.longitude

      const point: Point = new Point(lat, lng)

      if (options.includes(RouteOption.PANORAMA_ID)) {
        optionPromises.push(
          this.panoramaImageProvider
            .getPanoramaImageId(lat, lng)
            .then((res: Response<PanoramaImageId>) => {
              if (res.status != Status.OK || !res.data) {
                return {
                  error: 'Unable to fetch panorama id.',
                  status: Status.INTERNAL_ERROR
                }
              }

              point.panoramaId = res.data.panoramaId
            })
        )
      }

      if (options.includes(RouteOption.PANORAMA_TEXT)) {
        // Gather text from three different images to simulate a panorama image
        for (let heading = 0; heading < 360; heading += 120) {
          optionPromises.push(
            this.panoramaImageProvider
              .getPanoramaImage(lat, lng, heading)
              .then((res: Response<PanoramaImage>) => {
                if (res.status != Status.OK || !res.data) {
                  return {
                    error: 'Unable to fetch panorama text.',
                    status: Status.INTERNAL_ERROR
                  }
                }

                return this.ocrProvider.extractTextFromImage(res.data.base64)
              })
              .then((res: Response<ExtractedText>) => {
                // Todo: better error handling
                if (res.status != Status.OK || !res.data) {
                  return {
                    error: 'Unable to extract text from image.',
                    status: Status.INTERNAL_ERROR
                  }
                }

                point.addPanoramaText(res.data.text)
              })
          )
        }
      }

      points.push(point)
    })

    if (points.length == 0 || points.length != coordinates.length) {
      return {
        error: 'Points were missing in this route!',
        status: Status.INTERNAL_ERROR
      }
    }

    const route = new Route(origin, destination, points, increment)
    route.addWaypoints(waypoints)
    route.addOptions(options)

    return {
      data: {
        route
      },
      status: Status.OK
    }
  }
}

/**
 * Wrapping route within an object so we can always access
 * data via 'response.data.route'.
 *
 * Otherwise, we would access it like 'response.data.RouteProperties'
 */
type RouteData = {
  route: Route
}

export {RouteFactory, RouteFactoryResponse, RouteData}
