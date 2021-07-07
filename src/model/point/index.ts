import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

export type Point = {
  location: LatLngLiteralVerbose
  panoramaId?: string
  panoramaText?: string[]
}

export * from './point-factory'
