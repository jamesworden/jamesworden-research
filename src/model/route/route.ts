import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Option} from '../option'
import {Point} from '../point'

export type Route = {
  origin: string
  destination: string
  distance: number
  increment: number
  points: Point[]
  options: Option[]
  waypoints: LatLngLiteralVerbose[]
}
