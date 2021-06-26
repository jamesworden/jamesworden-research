import {
  Client,
  DirectionsRoute,
  LatLngLiteralVerbose,
  SnapToRoadsResponse,
  TravelMode
} from '@googlemaps/google-maps-services-js'
import {Directions, DirectionsProvider} from './directions.provider'
import {Response, Status} from '../util/response-protocol'

import {DirectionsResponse} from '@googlemaps/google-maps-services-js/dist/directions'
import {MAX_POINTS_PER_ROUTE} from 'src/config/constants'
import {calculations} from '../util/calculations'
import {decode} from 'polyline'

/**
 * Todo: split this class into the directions provider and incremental point creator from directions
 *
 * Ideally, many different API's can return directions that we can get incremental coordiante arrays from
 * This method for getting incremental points is too connected to Google Maps API
 */
class GoogleMaps implements DirectionsProvider {
  readonly apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string
  private client: Client = new Client()

  async getDirections(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[],
    increment: number
  ): Promise<Response<Directions>> {
    const response: DirectionsResponse = await this.client.directions({
      params: {
        origin,
        destination,
        waypoints,
        key: this.apiKey,
        mode: TravelMode.driving
      }
    })

    const responseStatus: string = response.data.status

    if (responseStatus != 'OK') {
      if (responseStatus == 'NOT_FOUND' || responseStatus == 'ZERO_RESULTS') {
        return {
          error: 'The specified directions could not be found!',
          status: Status.INTERNAL_ERROR
        }
      }

      // Todo: add logging function for when the status is INTERNAL ERROR
      return {
        error: 'Error fetching data from Google.',
        status: Status.INTERNAL_ERROR
      }
    }

    const route: DirectionsRoute = response.data.routes[0]
    const encodedPolyline: string = route.overview_polyline.points
    const distance = this.getDistance(route)

    const numPoints = distance / increment

    if (numPoints > MAX_POINTS_PER_ROUTE) {
      return {
        error: `There were too many points for this route! \nYour route: ${numPoints}, max: ${MAX_POINTS_PER_ROUTE} `,
        status: Status.INTERNAL_ERROR
      }
    }

    const rawCoordinates = this.getCoordinates(encodedPolyline, increment)
    const coordinates = await this.getSnappedCoordinates(rawCoordinates)

    return {
      data: {
        distance,
        coordinates
      },
      status: Status.OK
    }
  }

  private async getSnappedCoordinates(
    coordinates: LatLngLiteralVerbose[]
  ): Promise<LatLngLiteralVerbose[]> {
    return await this.client
      .snapToRoads({
        params: {
          path: coordinates,
          key: this.apiKey
        }
      })
      .then((response: SnapToRoadsResponse) => {
        let coordinates: LatLngLiteralVerbose[] = []

        response.data.snappedPoints.forEach((snappedPoint) => {
          coordinates.push(snappedPoint.location)
        })

        return coordinates
      })
  }

  private getDistance(route: DirectionsRoute): number {
    let distance = 0

    route.legs.forEach((leg) => {
      if (leg.distance && leg.distance.value) {
        distance += leg.distance.value
      }
    })

    return distance
  }

  private getCoordinates(
    encodedPolyline: string,
    increment: number
  ): LatLngLiteralVerbose[] {
    let decodedPoints: any[] = decode(encodedPolyline),
      validPoints: LatLngLiteralVerbose[] = [],
      distanceUntilNextPoint: number = 0, // Starts at 0 because 1st point should be added immediately
      i: number = 0,
      currentPoint: LatLngLiteralVerbose = {
        latitude: decodedPoints[0][0],
        longitude: decodedPoints[0][1]
      }

    while (i < decodedPoints.length) {
      const decodedNextPoint = decodedPoints[i + 1]

      if (decodedNextPoint == undefined) {
        break
      }

      const nextPoint: LatLngLiteralVerbose = {
        latitude: decodedNextPoint[0],
        longitude: decodedNextPoint[1]
      }

      const distanceBetweenPoints: number =
        calculations.getDistanceBetweenPoints(currentPoint, nextPoint)

      if (distanceBetweenPoints < distanceUntilNextPoint) {
        distanceUntilNextPoint -= distanceBetweenPoints
        currentPoint = nextPoint
        i++
      } else {
        const newPoint: LatLngLiteralVerbose =
          calculations.getIntermediatePoint(
            currentPoint,
            nextPoint,
            distanceUntilNextPoint
          )

        validPoints.push(newPoint)
        currentPoint = newPoint // Set current position to newly added point
        distanceUntilNextPoint = increment // Point added, reset distance
      }
    }
    return validPoints
  }
}

export const googleMaps = new GoogleMaps()
