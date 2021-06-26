import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Response} from 'src/util/response-utils'

interface DirectionsProvider {
  /**
   * Get directions from an origin address, destination address, and detour waypoints
   */
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
