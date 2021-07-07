import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

class Calculations {
  /**
   * https://www.movable-type.co.uk/scripts/latlong.html
   * @returns distance in meters
   */
  getDistanceBetweenPoints(
    pointA: LatLngLiteralVerbose,
    pointB: LatLngLiteralVerbose
  ): number {
    const lat1 = pointA.latitude
    const lat2 = pointB.latitude
    const lon1 = pointA.longitude
    const lon2 = pointB.longitude

    const R = 6371e3 // metres
    const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const d = R * c // in metres

    return d
  }

  getIntermediatePoint(
    pointA: LatLngLiteralVerbose,
    pointB: LatLngLiteralVerbose,
    distance: number
  ): LatLngLiteralVerbose {
    const bearing = this.getBearingFromPoints(pointA, pointB)
    return this.getPointFromDistance(pointA, distance, bearing)
  }

  /**
   * https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
   */
  getBearingFromPoints(
    pointA: LatLngLiteralVerbose,
    pointB: LatLngLiteralVerbose
  ): number {
    const startLat: number = this.toRadians(pointA.latitude)
    const startLng: number = this.toRadians(pointA.longitude)
    const destLat: number = this.toRadians(pointB.latitude)
    const destLng: number = this.toRadians(pointB.longitude)

    const y: number = Math.sin(destLng - startLng) * Math.cos(destLat)
    const x: number =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)

    const bearing: number = this.toDegrees(Math.atan2(y, x))
    return (bearing + 360) % 360
  }

  /**
   * https://stackoverflow.com/a/46410871/13549
   *
   * TODO: Gives super inaccurate answer when calculating large distances horizontally
   */
  getPointFromDistance(
    point: LatLngLiteralVerbose,
    distance: number,
    bearing: number
  ): LatLngLiteralVerbose {
    distance /= 1000 // Convert distance from M to KM
    bearing = (bearing * Math.PI) / 180 // Convert bearing to radian
    let radius = 6378.1, // Radius of the Earth
      radianLatitude = (point.latitude * Math.PI) / 180, // Current coords to radians
      radianLongitude = (point.longitude * Math.PI) / 180

    radianLatitude = Math.asin(
      Math.sin(radianLatitude) * Math.cos(distance / radius) +
        Math.cos(radianLatitude) *
          Math.sin(distance / radius) *
          Math.cos(bearing)
    )
    radianLongitude += Math.atan2(
      Math.sin(bearing) *
        Math.sin(distance / radius) *
        Math.cos(radianLongitude),
      Math.cos(distance / radius) -
        Math.sin(radianLongitude) * Math.sin(radianLongitude)
    )

    // Coords back to degrees and return
    const latitude = (radianLatitude * 180) / Math.PI
    const longitude = (radianLongitude * 180) / Math.PI

    return {
      latitude,
      longitude
    }
  }

  // Converts from degrees to radians
  toRadians = (degrees: number): number => (degrees * Math.PI) / 180

  // Converts from radians to degrees
  toDegrees = (radians: number): number => (radians * 180) / Math.PI
}

export const calculations = new Calculations()
