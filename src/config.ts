// All distance is measured in meters

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

export const MAX_POINTS_PER_ROUTE = 100 // Google's snap to points relies on this

export const MAX_DISTANCE_PER_ROUTE = 5000

export const MAX_WAYPOINTS_PER_ROUTE = 10

export const DEFAULT_INCREMENT_DISTANCE = 5

export const BOUNDS_DISTANCE = 1000

export const __prod__ = process.env.NODE_ENV === 'production'

export const DEFAULT_MAP_CENTER_LOCATION: LatLngLiteralVerbose = {
  latitude: 40.747825,
  longitude: -73.992944
}

export const MAX_SPECIFIC_MAP_POINTS = 5
