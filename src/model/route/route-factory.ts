import {Directions, DirectionsProvider} from '../../provider'
import {Failure, isFailure} from '../../util'
import {Option, Point} from '..'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Route} from '.'
import {app} from '../../app'

class RouteFactory {
  directionsProvider: DirectionsProvider
  _origin: string
  _destination: string
  _waypoints: LatLngLiteralVerbose[]
  _options: Option[]
  _increment: number

  constructor(directionsProvider: DirectionsProvider) {
    this.directionsProvider = directionsProvider
  }

  async createRoute(
    origin: string,
    destination: string,
    increment: number,
    waypoints: LatLngLiteralVerbose[],
    options: Option[]
  ): Promise<Route | Failure> {
    this._origin = origin
    this._destination = destination
    this._waypoints = waypoints
    this._options = options
    this._increment = increment

    const directionsResponse: Directions | Failure =
      await this.directionsProvider.getDirections(
        origin,
        destination,
        waypoints,
        increment
      )

    if (isFailure(directionsResponse)) {
      return directionsResponse
    }

    const directions: Directions = directionsResponse

    return this.createRouteFromDirections(directions)
  }

  private async createRouteFromDirections(
    directions: Directions
  ): Promise<Route | Failure> {
    const coordinates: LatLngLiteralVerbose[] = directions.coordinates

    let pointsRes: Point[] | Failure = await this.createPoints(coordinates)

    if (isFailure(pointsRes)) {
      return pointsRes
    }

    const origin: string = this._origin
    const destination: string = this._destination
    const distance: number = directions.distance
    const increment: number = this._increment
    const points: Point[] = pointsRes
    const waypoints: LatLngLiteralVerbose[] = this._waypoints
    const options: Option[] = this._options

    const route = new Route(origin, destination, distance, increment, points)
    route.addWaypoints(waypoints)
    route.addOptions(options)

    return route
  }

  private async createPoints(
    locations: LatLngLiteralVerbose[]
  ): Promise<Point[] | Failure> {
    const potentialPoints: Array<Point | Failure> =
      await this.getPotentialPoints(locations)

    const failure: Failure | undefined =
      this.getFailureFromPoints(potentialPoints)

    if (failure) {
      return failure
    }

    return potentialPoints as Point[]
  }

  private async getPotentialPoints(locations: LatLngLiteralVerbose[]) {
    const pointPromises: Promise<void>[] = []
    const points: Array<Point | Failure> = []

    for (let location of locations) {
      pointPromises.push(
        app.pointFactory
          .createPoint(location, this._options)
          .then((pointRes) => {
            points.push(pointRes)
          })
      )
    }

    Promise.all(pointPromises)
    return points
  }

  private getFailureFromPoints(
    points: Array<Point | Failure>
  ): Failure | undefined {
    for (const point of points) {
      if (isFailure(point)) {
        return point
      }
    }

    return
  }
}

export {RouteFactory}
