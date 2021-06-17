import {Point} from '../model/Point'

/**
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */
const getDistanceBetweenPoints = (pointA: Point, pointB: Point): number => {
  var p = 0.017453292519943295 // Math.PI / 180
  var c = Math.cos
  var a =
    0.5 -
    c((pointB.latitude - pointA.latitude) * p) / 2 +
    (c(pointA.latitude * p) *
      c(pointB.latitude * p) *
      (1 - c((pointB.longitude - pointA.longitude) * p))) /
      2

  return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
}

/**
 * @author James Worden
 * @returns point between two points that is a certain distance away from the first
 */
const getIntermediatePoint = (
  pointA: Point,
  pointB: Point,
  distance: number
): Point => {
  const bearing = getBearingFromPoints(pointA, pointB)
  return getPointFromDistance(pointA, distance, bearing)
}

/**
 * https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
 * @returns initial bearing in degrees from North in degrees
 */
const getBearingFromPoints = (pointA: Point, pointB: Point): number => {
  const startLat: number = toRadians(pointA.latitude)
  const startLng: number = toRadians(pointA.longitude)
  const destLat: number = toRadians(pointB.latitude)
  const destLng: number = toRadians(pointB.longitude)
  const y: number = Math.sin(destLng - startLng) * Math.cos(destLat)
  const x: number =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
  const bearing: number = toDegrees(Math.atan2(y, x))
  return (bearing + 360) % 360
}

/**
 * https://stackoverflow.com/a/46410871/13549
 * @returns point that is a given distance and angle from a given point
 */
const getPointFromDistance = function (
  point: Point,
  distance: number,
  bearing: number
): Point {
  distance /= 1000 // Convert distance from M to KM
  bearing = (bearing * Math.PI) / 180 // Convert bearing to radian
  let radius = 6378.1, // Radius of the Earth
    radianLatitude = (point.latitude * Math.PI) / 180, // Current coords to radians
    radianLongitude = (point.longitude * Math.PI) / 180

  radianLatitude = Math.asin(
    Math.sin(radianLatitude) * Math.cos(distance / radius) +
      Math.cos(radianLatitude) * Math.sin(distance / radius) * Math.cos(bearing)
  )
  radianLongitude += Math.atan2(
    Math.sin(bearing) * Math.sin(distance / radius) * Math.cos(radianLongitude),
    Math.cos(distance / radius) -
      Math.sin(radianLongitude) * Math.sin(radianLongitude)
  )

  // Coords back to degrees and return
  const latitude = (radianLatitude * 180) / Math.PI
  const longitude = (radianLongitude * 180) / Math.PI
  return new Point(latitude, longitude)
}

/* Converts from degrees to radians. */
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/* Converts from radians to degrees. */
const toDegrees = (radians: number): number => (radians * 180) / Math.PI

export {
  getDistanceBetweenPoints,
  getIntermediatePoint,
  getPointFromDistance,
  getBearingFromPoints
}
