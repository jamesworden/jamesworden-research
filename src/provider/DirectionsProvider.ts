import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Response} from 'src/model/Status'

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
  ): Promise<Response<Directions>>
  readonly apiKey: string
}

type Directions = {
  distance: number
  coordinates: LatLngLiteralVerbose[]
}

export {DirectionsProvider, Directions}
