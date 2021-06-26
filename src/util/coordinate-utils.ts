import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {calculations} from './calculations'

class CoordinateUtils {
  /**
   * TODO: Have one single protocol to connect coordinate pairs.
   * Make a utility function in this class to convert 'number[][]'
   * into 'LatLngLiteralVerbose[]' - which is the better unit.
   *
   * The polyline NPM package decodes polylines into number[][]
   * arrays, maybe stick the polyline stuff here in some utility function?
   * Like: get LatLngLiteralVerbose[] from encoded polyline?
   *
   * Other API's might demand new coordinateUtils to function, which is good
   * model of expanding providers.
   *
   * @param coordinates array of gps coordinate pairs
   * @param increment distance to increment returned array of coordinates by
   * @returns array incrementally spaced coordinates
   */
  getIncrementalCoordinates(
    coordinates: number[][],
    increment: number
  ): LatLngLiteralVerbose[] {
    let validPoints: LatLngLiteralVerbose[] = []
    let distanceUntilNextPoint: number = 0 // Starts at 0 because 1st point should be added immediately
    let i: number = 0
    let currentPoint: LatLngLiteralVerbose = {
      latitude: coordinates[0][0],
      longitude: coordinates[0][1]
    }

    while (i < coordinates.length) {
      const decodedNextPoint = coordinates[i + 1]

      if (!decodedNextPoint) {
        break
      }

      const nextPoint: LatLngLiteralVerbose = {
        latitude: decodedNextPoint[0],
        longitude: decodedNextPoint[1]
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
}

export const coordinateUtils = new CoordinateUtils()
