import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Option} from '..'
import {Point} from '..'

class Route {
  origin: string
  destination: string
  distance: number
  increment: number
  points: Point[]
  options: Option[]
  waypoints: LatLngLiteralVerbose[]

  constructor(
    origin: string,
    destination: string,
    distance: number,
    increment: number,
    points: Point[]
  ) {
    this.origin = origin
    this.destination = destination
    this.distance = distance
    this.increment = increment
    this.points = points
  }

  addOptions(options: Option[]) {
    if (!this.options) {
      this.options = options
    }

    this.options.concat(options)
  }

  addWaypoints(waypoints: LatLngLiteralVerbose[]) {
    if (!this.waypoints) {
      this.waypoints = waypoints
    }

    this.waypoints.concat(waypoints)
  }

  containsPanoramaText(): boolean {
    if (!this.options) {
      return false
    }

    return this.options.includes(Option.PANORAMA_TEXT)
  }
}

export {Route}

export * from './route-factory'
