import {Failure} from '../../util'
import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

interface DirectionsProvider {
  getDirections(
    origin: string,
    destination: string,
    waypoints: LatLngLiteralVerbose[],
    increment: number
  ): Promise<Directions | Failure>
  readonly apiKey: string
}

type Directions = {
  distance: number
  coordinates: LatLngLiteralVerbose[]
}

export {DirectionsProvider, Directions}
