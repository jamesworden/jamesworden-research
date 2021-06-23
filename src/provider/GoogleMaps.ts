import * as Calculations from '../util/Calculations'

import {
  Client,
  DirectionsRoute,
  LatLng,
  LatLngLiteralVerbose,
  SnapToRoadsResponse,
  TravelMode
} from '@googlemaps/google-maps-services-js'

import {Directions} from './DirectionsProvider'
import {DirectionsResponse} from '@googlemaps/google-maps-services-js/dist/directions'
import {decode} from 'polyline'

class GoogleMapsService {
  private apiKey: string
  private client: Client

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY as string
    this.client = new Client()
  }

  async getDirections(
    origin: string,
    destination: string,
    waypoints: LatLng[],
    increment: number
  ): Promise<Directions> {
    const response: DirectionsResponse = await this.client.directions({
      params: {
        origin,
        destination,
        waypoints,
        key: this.apiKey,
        mode: TravelMode.driving
      }
    })

    const route: DirectionsRoute = response.data.routes[0]
    const encodedPolyline = route.overview_polyline.points

    const distance = this.getDistance(route)
    const coordinates = this.getCoordinates(encodedPolyline, increment)
    const status = this.getStatus(response.data.status)

    return {
      distance,
      coordinates,
      status
    }
  }

  async getSnappedPoints(
    points: LatLngLiteralVerbose[]
  ): Promise<LatLngLiteralVerbose[]> {
    return await this.client
      .snapToRoads({
        params: {
          path: points,
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
        Calculations.getDistanceBetweenPoints(currentPoint, nextPoint)

      if (distanceBetweenPoints < distanceUntilNextPoint) {
        distanceUntilNextPoint -= distanceBetweenPoints
        currentPoint = nextPoint
        i++
      } else {
        const newPoint: LatLngLiteralVerbose =
          Calculations.getIntermediatePoint(
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

  private getStatus(status: string): string {}
}

export const googleMapsService = new GoogleMapsService()
