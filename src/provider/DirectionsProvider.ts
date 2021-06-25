import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

/**
 * Todo: As stated in the Google Maps class, we should break this up into
 * an incremental waypoint provider from directions.
 */
interface DirectionsProvider {
  // Get directions from an origin address, destination address, and detour waypoints
  getDirections(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[],
    increment: number
  ): Promise<DirectionsResponse>
  readonly apiKey: string
}

type DirectionsResponse = {
  data?: {
    distance: number
    coordinates: LatLngLiteralVerbose[]
  }
  status: DirectionsStatus
  message?: string
}

enum DirectionsStatus {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request!',
  NOT_FOUND = 'The specified directions could not be found!',
  EXCEEDED_MAXIMUM_DISTANCE = 'The specified route is too long!',
  ERROR_SNAPPING_POINTS = 'We were unable to snap your points to nearby roads!',
  TOO_MANY_POINTS = 'There were too many points for this route!'
}

export {DirectionsResponse, DirectionsProvider, DirectionsStatus}
