import * as Calculations from './Calculations'

import {DirectionsRoute} from '@googlemaps/google-maps-services-js'
import {Location} from 'src/model/Location'
import {decode} from 'polyline'

const getDistance = (route: DirectionsRoute): number => {
  let distance = 0

  route.legs.forEach((leg) => {
    if (leg.distance && leg.distance.value) {
      distance += leg.distance.value
    }
  })

  return distance
}

const getLocations = (
  encodedPolyline: string,
  increment: number
): Location[] => {
  let decodedPoints: any[] = decode(encodedPolyline),
    validPoints: Location[] = [],
    distanceUntilNextPoint: number = 0, // Starts at 0 because 1st point should be added immediately
    i: number = 0,
    currentPoint: Location = {
      latitude: decodedPoints[0][0],
      longitude: decodedPoints[0][1]
    }

  while (i < decodedPoints.length) {
    const decodedNextPoint = decodedPoints[i + 1]

    if (decodedNextPoint == undefined) {
      break
    }

    const nextPoint: Location = {
      latitude: decodedNextPoint[0],
      longitude: decodedNextPoint[1]
    }

    const distanceBetweenPoints: number = Calculations.getDistanceBetweenPoints(
      currentPoint,
      nextPoint
    )

    if (distanceBetweenPoints < distanceUntilNextPoint) {
      distanceUntilNextPoint -= distanceBetweenPoints
      currentPoint = nextPoint
      i++
    } else {
      const newPoint: Location = Calculations.getIntermediatePoint(
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

export {getDistance, getLocations}
