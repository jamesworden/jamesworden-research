import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {Option} from '..'
import {Point} from '..'

export type Route = {
  origin: string
  destination: string
  distance: number
  increment: number
  points: Point[]
  options: Option[]
  waypoints: LatLngLiteralVerbose[]
}

export * from './route-factory'
