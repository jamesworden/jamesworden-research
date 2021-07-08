import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {calculations} from '../calculations'

class CoordinateUtils {
  /**
   *
   * @param originalCoordinates array of gps coordinate pairs
   * @param increment distance to increment returned array of coordinates by
   * @returns array incrementally spaced coordinates
   */
  getIncrementalCoordinates(
    originalCoordinates: LatLngLiteralVerbose[],
    increment: number
  ): LatLngLiteralVerbose[] {
    const indexOfLastOriginalCoordinate = originalCoordinates.length - 1
    let validPoints: LatLngLiteralVerbose[] = []
    let distanceUntilNextPoint: number = 0
    let originalCoordinatesTranscended: number = 0

    let currentPoint: LatLngLiteralVerbose = originalCoordinates[0]

    while (originalCoordinatesTranscended < indexOfLastOriginalCoordinate) {
      const decodedNextPoint =
        originalCoordinates[originalCoordinatesTranscended + 1]

      const nextPoint: LatLngLiteralVerbose = {
        latitude: decodedNextPoint.latitude,
        longitude: decodedNextPoint.longitude
      }

      const distanceBetweenPoints: number =
        calculations.getDistanceBetweenPoints(currentPoint, nextPoint)

      if (distanceBetweenPoints < distanceUntilNextPoint) {
        distanceUntilNextPoint -= distanceBetweenPoints
        currentPoint = nextPoint
        originalCoordinatesTranscended++
      }

      const newPoint: LatLngLiteralVerbose = calculations.getIntermediatePoint(
        currentPoint,
        nextPoint,
        distanceUntilNextPoint
      )

      validPoints.push(newPoint)
      currentPoint = newPoint // Set current position to newly added point
      distanceUntilNextPoint = increment // Point added, reset distance
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
