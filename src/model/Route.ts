import * as DataProcessing from '../util/DataProcessing'

import {
  DirectionsRoute,
  LatLng,
  LatLngLiteralVerbose
} from '@googlemaps/google-maps-services-js'
import {
  MAX_POINTS_PER_ROUTE,
  MAX_WAYPOINTS_PER_ROUTE
} from '../config/Constants'

import {DirectionsResponseData} from '@googlemaps/google-maps-services-js/dist/directions'
import {Point} from '../model/Point'
import {googleCloudVisionService} from '../service/GoogleCloudVisionService'
import {googleMapsService} from '../service/GoogleMapsService'
import {googleStreetViewService} from '../service/GoogleStreetViewService'

class Route {
  origin: string
  destination: string
  waypoints: LatLngLiteralVerbose[]
  distance: number
  increment: number
  status: Status
  points: Point[]
  options?: Option[]

  constructor(
    origin: string,
    destination: string,
    increment: number,
    status: Status,
    points: Point[],
    waypoints?: LatLngLiteralVerbose[]
  ) {
    this.origin = origin
    this.destination = destination
    this.increment = increment
    this.status = status
    this.points = points

    if (waypoints) {
      this.waypoints = waypoints
    }
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
  INVALID_WAYPOINT_VALUES = 'Invalid waypoint values. Please use valid latitude and longitude coordinates.'
}

enum Option {
  PANORAMA_TEXT = 'PANORAMA_TEXT',
  PANORAMA_ID = 'PANORAMA_ID'
}

export {Route, Status, Option}
