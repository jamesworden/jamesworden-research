import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Point} from '../point/point'

class Route {
  origin: string
  destination: string
  distance: number
  points: Point[]
  increment: number
  options?: RouteOption[]
  waypoints?: LatLngLiteralVerbose[]

  constructor(
    origin: string,
    destination: string,
    points: Point[],
    increment: number,
    distance: number
  ) {
    this.origin = origin
    this.destination = destination
    this.points = points
    this.increment = increment
    this.distance = distance
  }

  addOptions(options: RouteOption[]) {
    if (this.options == undefined) {
      this.options = []
    }
    this.options.concat(options)
  }

  addWaypoints(waypoints: LatLngLiteralVerbose[]) {
    if (this.waypoints == undefined) {
      this.waypoints = []
    }
    this.waypoints.concat(waypoints)
  }

  // Created specifically for report generation
  containsPanoramaText(): boolean {
    if (!this.options) {
      return false
    }

    return this.options.includes(RouteOption.PANORAMA_TEXT)
  }
}

enum RouteOption {
  PANORAMA_TEXT = 'PANORAMA_TEXT',
  PANORAMA_ID = 'PANORAMA_ID'
}

export {Route, RouteOption}
