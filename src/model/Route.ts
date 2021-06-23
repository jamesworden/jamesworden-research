import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Point} from '../model/Point'

class Route {
  origin: string
  destination: string
  distance: number
  status: Status
  points: Point[]
  options?: Option[]
  increment?: number
  waypoints?: LatLngLiteralVerbose[]

  constructor(
    origin: string,
    destination: string,
    status: Status,
    points: Point[],
    options: Option[],
    increment?: number,
    waypoints?: LatLngLiteralVerbose[]
  ) {
    this.origin = origin
    this.destination = destination
    this.status = status
    this.points = points

    if (options) this.options = options
    if (increment) this.increment = increment
    if (waypoints) this.waypoints = waypoints
  }
}

enum Status {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request!',
  ROUTE_NOT_FOUND = 'The specified route could not be found!',
  NOT_INITALIZED = 'The route has not been initalized yet.',
  EXCEEDED_MAXIMUM_DISTANCE = 'The specified route is too long!',
  ERROR_FETCHING_DIRECTIONS = 'We were unable to fetch the data from Google!',
  ERROR_SNAPPING_POINTS = 'We were unable to snap your points to nearby roads!',
  TOO_MANY_WAYPOINTS = 'There were too many waypoints in your request!',
  INVALID_WAYPOINT_FORMAT = "Invalid waypoint format. Try this: 'latitude1,longitude1|latitude2,longitude2|...'",
  INVALID_WAYPOINT_VALUES = 'Invalid waypoint values. Please use valid latitude and longitude coordinates.',
  NON_INCREMENTAL_ROUTE = 'This route does not list points incrementally.'
}

enum Option {
  PANORAMA_TEXT = 'PANORAMA_TEXT',
  PANORAMA_ID = 'PANORAMA_ID'
}

export {Route, Status, Option}
