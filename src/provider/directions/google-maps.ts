import {
  Client,
  DirectionsRoute,
  LatLngLiteralVerbose,
  SnapToRoadsResponse,
  TravelMode
} from '@googlemaps/google-maps-services-js'
import {Directions, DirectionsProvider} from '.'
import {
  DirectionsRequest,
  DirectionsResponse
} from '@googlemaps/google-maps-services-js/dist/directions'
import {Failure, HttpStatusCode, coordinateUtils, isFailure} from '../../util'
import {MAX_POINTS_PER_ROUTE, MAX_WAYPOINTS_PER_ROUTE} from '../../config'

import {decode} from 'polyline'

class GoogleMaps implements DirectionsProvider {
  readonly apiKey: string = process.env.GOOGLE_MAPS_BACKEND_KEY as string
  private client: Client = new Client()
  private _increment: number

  async getDirections(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[],
    increment: number
  ): Promise<Directions | Failure> {
    const directionsResponse: DirectionsResponse | Failure =
      await this.getGoogleMapsDirectionsResponse(origin, destination, waypoints)

    if (isFailure(directionsResponse)) {
      return directionsResponse
    }

    this._increment = increment

    const directions: Directions | Failure =
      await this.getDirectionsFromDirectionsResponse(directionsResponse)

    return directions
  }

  private async getDirectionsFromDirectionsResponse(
    directionsResponse: DirectionsResponse
  ): Promise<Directions | Failure> {
    const route: DirectionsRoute = directionsResponse.data.routes[0]
    const distance = this.getDistance(route)
    const numPoints = distance / this._increment

    if (numPoints > MAX_POINTS_PER_ROUTE) {
      return {
        response: {
          error: `There were too many points for this route! Your route: ${numPoints}, max: ${MAX_POINTS_PER_ROUTE} `
        },
        statusCode: HttpStatusCode.NOT_ACCEPTABLE
      }
    }

    const encodedPolyline: string = route.overview_polyline.points

    return this.getDirectionsFromEncodedPolylineAndDistance(
      encodedPolyline,
      distance
    )
  }

  private async getDirectionsFromEncodedPolylineAndDistance(
    encodedPolyline: string,
    distance: number
  ) {
    const coordinates: LatLngLiteralVerbose[] | Failure =
      await this.getIncrementalCoordinatesFromEncodedPolyline(encodedPolyline)

    if (isFailure(coordinates)) {
      return coordinates
    }

    return {
      coordinates,
      distance
    }
  }

  private async getIncrementalCoordinatesFromEncodedPolyline(
    encodedPolyline: string
  ): Promise<LatLngLiteralVerbose[] | Failure> {
    const decodedCoodrinates: number[][] = decode(encodedPolyline)

    const decodedLatLngCoords: LatLngLiteralVerbose[] =
      coordinateUtils.numToLatLng(decodedCoodrinates)

    const incrementalCoordinates = coordinateUtils.getIncrementalCoordinates(
      decodedLatLngCoords,
      this._increment
    )

    if (incrementalCoordinates.length > MAX_POINTS_PER_ROUTE) {
      return {
        response: {
          error: `Too many points (${MAX_POINTS_PER_ROUTE} max).`,
          message: `Your route had ${decodedLatLngCoords.length} raw points which converted to ${incrementalCoordinates.length} snapped incremental points.`
        },
        statusCode: HttpStatusCode.NOT_ACCEPTABLE
      }
    }

    const snappedIncrementalCoordinates: LatLngLiteralVerbose[] =
      await this.getSnappedCoordinates(incrementalCoordinates)

    return snappedIncrementalCoordinates
  }

  private async getGoogleMapsDirectionsResponse(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[]
  ) {
    const request: DirectionsRequest = {
      params: {
        origin,
        destination,
        waypoints,
        key: this.apiKey,
        mode: TravelMode.driving
      }
    }

    const response: DirectionsResponse = await this.client.directions(request)

    const responseStatus: string = response.data.status

    if (responseStatus != 'OK') {
      return this.getFailureFromStatus(responseStatus)
    }

    return response
  }

  private getFailureFromStatus(status: string): Failure {
    if (status == 'NOT_FOUND' || status == 'ZERO_RESULTS') {
      return {
        response: {
          error: 'The specified directions could not be found!'
        },
        statusCode: HttpStatusCode.NOT_FOUND
      }
    }

    return {
      response: {
        error: 'Error fetching data from Google.'
      },
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    }
  }

  private async getSnappedCoordinates(
    coordinates: LatLngLiteralVerbose[]
  ): Promise<LatLngLiteralVerbose[]> {
    if (coordinates.length <= 0) {
      return []
    }

    const response: SnapToRoadsResponse = await this.client.snapToRoads({
      params: {
        path: coordinates,
        key: this.apiKey,
        interpolate: false
      }
    })

    return this.getCoordinatesFromSnapToRoadsResponse(response)
  }

  private getCoordinatesFromSnapToRoadsResponse(response: SnapToRoadsResponse) {
    let coordinates: LatLngLiteralVerbose[] = []

    response.data.snappedPoints.forEach((snappedPoint) => {
      coordinates.push(snappedPoint.location)
    })

    return coordinates
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
}

export const googleMaps = new GoogleMaps()
