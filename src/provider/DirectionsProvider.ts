import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

interface DirectionsProvider {
  // Get directions from an origin address, destination address, and detour waypoints
  getDirections(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[]
  ): LatLngLiteralVerbose[]
  readonly apiKey: string
}

export {DirectionsProvider}
