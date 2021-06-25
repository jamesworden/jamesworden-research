import {
  DirectionsProvider,
  DirectionsResponse,
  DirectionsStatus
} from 'src/provider/DirectionsProvider'
import {
  ExtractedTextResponse,
  ExtractedTextStatus,
  OcrProvider
} from 'src/provider/OcrProvider'
import {
  PanoramaImageIdResponse,
  PanoramaImageIdStatus,
  PanoramaImageProvider,
  PanoramaImageResponse,
  PanoramaImageStatus
} from 'src/provider/PanoramaImageProvider'
import {Route, RouteOption} from './Route'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Point} from './Point'

type RouteFactoryResponse = {
  data?: {
    route: Route
  }
  status: RouteFactoryStatus
}

enum RouteFactoryStatus {
  OK = 'Successfully created route!',
  INTERNAL_ERROR = 'There was an error creating the route!'
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
  ): Promise<RouteFactoryResponse> {
    const directionsResponse: DirectionsResponse =
      await this.directionsProvider.getDirections(
        origin,
        destination,
        waypoints,
        increment
      )

    if (
      directionsResponse.status != DirectionsStatus.OK ||
      !directionsResponse.data
    ) {
      return {status: RouteFactoryStatus.INTERNAL_ERROR}
    }

    const coordinates = directionsResponse.data.coordinates

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
            .then((res: PanoramaImageIdResponse) => {
              // Todo: better error handling
              if (res.status != PanoramaImageIdStatus.OK || !res.data) {
                return
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
              .then((res: PanoramaImageResponse) => {
                // Todo: better error handling
                if (res.status != PanoramaImageStatus.OK || !res.data) {
                  return
                }

                return this.ocrProvider.extractTextFromImage(res.data.base64)
              })
              .then((res: ExtractedTextResponse | undefined) => {
                // Todo: better error handling
                if (!res || res.status != ExtractedTextStatus.OK || !res.data) {
                  return
                }

                point.addPanoramaText(res.data.text)
              })
          )
        }
      }

      points.push(point)
    })

    if (points.length == 0 || points.length != coordinates.length) {
      return {status: RouteFactoryStatus.INTERNAL_ERROR}
    }

    const route = new Route(origin, destination, points, increment)
    route.addWaypoints(waypoints)
    route.addOptions(options)

    return {
      data: {
        route
      },
      status: RouteFactoryStatus.OK
    }
  }
}

export {RouteFactory, RouteFactoryResponse, RouteFactoryStatus}
