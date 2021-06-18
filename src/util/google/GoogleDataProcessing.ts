import {DirectionsRoute, LatLng} from '@googlemaps/google-maps-services-js'
import {getDistanceBetweenPoints, getIntermediatePoint} from '../Calculations'

import {MAX_WAYPOINTS_PER_ROUTE} from '../../config/Constants'
import {Point} from '../../model/Point'
import {decode} from 'polyline'

/**
 * Get distance from a given leg
 * @param {Object[]} legs Array of legs
 * @returns Distance in meters
 */
const getDistance = (route: DirectionsRoute): number => {
  let legs = route.legs,
    distance = 0

  for (const leg of legs) {
    if (leg.distance && leg.distance.value) {
      distance += leg.distance.value
    }
  }

  return distance
}

/**
 * @param encodedPolyline Encoded polyline string returned by Google Directions route
 * @returns Array of points
 */
const getPoints = (encodedPolyline: string, increment: number): Point[] => {
  let decodedPoints: any[] = decode(encodedPolyline),
    validPoints: Point[] = [],
    distanceUntilNextPoint: number = 0, // Starts at 0 because 1st point should be added immediately
    currentPoint: Point = new Point(decodedPoints[0][0], decodedPoints[0][1]),
    i: number = 0

  while (i < decodedPoints.length) {
    const decodedNextPoint = decodedPoints[i + 1]

    if (decodedNextPoint == undefined) {
      break
    }

    const nextPoint: Point = new Point(decodedNextPoint[0], decodedNextPoint[1])

    const distanceBetweenPoints: number = getDistanceBetweenPoints(
      currentPoint,
      nextPoint
    )

    if (distanceBetweenPoints < distanceUntilNextPoint) {
      distanceUntilNextPoint -= distanceBetweenPoints
      currentPoint = nextPoint
      i++
    } else {
      const newPoint: Point = getIntermediatePoint(
        currentPoint,
        nextPoint,
        distanceUntilNextPoint
      )

      validPoints.push(newPoint)
      currentPoint = newPoint // Set current position to newly added point
      distanceUntilNextPoint = increment // Point added, reset distance
    }
  }
  return validPoints
}

const getWaypoints = (input: string): LatLng[] | string => {
  // Tests for undefined or whitespace only
  if (!input || !input.replace(/\s/g, '').length) {
    return 'There were no specified waypoints!'
  }

  let locations: string[] = input.split('|')

  if (locations.length > MAX_WAYPOINTS_PER_ROUTE) {
    return `There were too many waypoints specified! (Max: ${MAX_WAYPOINTS_PER_ROUTE})`
  }

  let waypoints: LatLng[] = []

  locations.forEach((location: string) => {
    var latLng: string[] = location.split(',')

    if (latLng.length != 2) {
      return `Invalid format. Multiple commas within coordinate pair section: ${location}`
    }

    var latitude: number = parseInt(latLng[0]),
      longitude: number = parseInt(latLng[1])

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return `Invalid coordinates: ${latLng[0]}, ${latLng[1]}`
    }

    waypoints.push({
      latitude,
      longitude
    })
  })

  return waypoints
}

export {getDistance, getPoints, getWaypoints}
