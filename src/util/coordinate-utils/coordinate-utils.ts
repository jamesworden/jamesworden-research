import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {calculations} from '../calculations/calculations'

class CoordinateUtils {
  /**
   *
   * @param coordinates array of gps coordinate pairs
   * @param increment distance to increment returned array of coordinates by
   * @returns array incrementally spaced coordinates
   */
  getIncrementalCoordinates(
    coordinates: LatLngLiteralVerbose[],
    increment: number
  ): LatLngLiteralVerbose[] {
    let validPoints: LatLngLiteralVerbose[] = []
    let distanceUntilNextPoint: number = 0 // Starts at 0 because 1st point should be added immediately
    let i: number = 1

    let currentPoint: LatLngLiteralVerbose = {
      latitude: coordinates[0].latitude,
      longitude: coordinates[0].longitude
    }

    while (i < coordinates.length) {
      const decodedNextPoint = coordinates[i + 1]

      if (!decodedNextPoint) {
        break
      }

      const nextPoint: LatLngLiteralVerbose = {
        latitude: decodedNextPoint.latitude,
        longitude: decodedNextPoint.longitude
      }

      const distanceBetweenPoints: number =
        calculations.getDistanceBetweenPoints(currentPoint, nextPoint)

      if (distanceBetweenPoints < distanceUntilNextPoint) {
        distanceUntilNextPoint -= distanceBetweenPoints
        currentPoint = nextPoint
        i++
      } else {
        const newPoint: LatLngLiteralVerbose =
          calculations.getIntermediatePoint(
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

  numToLatLng(coordinates: number[][]): LatLngLiteralVerbose[] {
    let latLngArr: LatLngLiteralVerbose[] = []

    coordinates.forEach((coordinatePair) => {
      latLngArr.push({
        latitude: coordinatePair[0],
        longitude: coordinatePair[1]
      })
    })

    return latLngArr
  }
}

export const coordinateUtils = new CoordinateUtils()
