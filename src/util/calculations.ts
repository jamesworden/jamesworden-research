import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'

class Calculations {
  /**
   *
   * @see {@link https://www.movable-type.co.uk/scripts/latlong.html}
   *
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

  /**
   *
   * @param distance in meters
   */
  getIntermediatePoint(
    pointA: LatLngLiteralVerbose,
    pointB: LatLngLiteralVerbose,
    distance: number
  ): LatLngLiteralVerbose {
    const bearing = this.getBearingFromPoints(pointA, pointB)
    return this.getPointFromDistance(pointA, distance, bearing)
  }

  /**
   *
   * @see {@link https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript}
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
   *
   * @see {@link https://stackoverflow.com/questions/2637023/how-to-calculate-the-latlng-of-a-point-a-certain-distance-away-from-another}
   *
   * @param distance in meters
   */
  getPointFromDistance(
    point: LatLngLiteralVerbose,
    distance: number,
    bearing: number
  ): LatLngLiteralVerbose {
    distance = distance / 6371000
    bearing = this.toRadians(bearing)

    let lat1: number = this.toRadians(point.latitude)
    let lon1: number = this.toRadians(point.longitude)

    let lat2: number = Math.asin(
      Math.sin(lat1) * Math.cos(distance) +
        Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)
    )

    let lon2: number =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1),
        Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
      )

    return {
      latitude: this.toDegrees(lat2),
      longitude: this.toDegrees(lon2)
    }
  }

  /**
   *
   * Converts from degrees to radians
   */
  toRadians = (degrees: number): number => (degrees * Math.PI) / 180

  /**
   *
   * Converts from radians to degrees
   */
  toDegrees = (radians: number): number => (radians * 180) / Math.PI
}

export const calculations = new Calculations()
