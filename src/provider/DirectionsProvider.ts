import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

interface DirectionsProvider {
  // Get directions from an origin address, destination address, and detour waypoints
  getDirections(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[]
  ): Promise<Directions>
  readonly apiKey: string
}

type Directions = {
  distance: number
  coordinates: LatLngLiteralVerbose[]
  status: string
}

enum DirectionsStatus {
  test = 'test'
}

export {Directions, DirectionsProvider, DirectionsStatus}
