import {Client, LatLng, TravelMode} from '@googlemaps/google-maps-services-js'
import {
  DirectionsResponse,
  DirectionsResponseData
} from '@googlemaps/google-maps-services-js/dist/directions'
import axios, {AxiosResponse} from 'axios'

import {Point} from '../../model/Point'

const googleMapsClient = new Client({}),
  key = process.env.GOOGLE_MAPS_BACKEND_KEY as string

/**
 * Get directions from Google Maps
 * @param {String} origin
 * @param {String} destination
 * @param {LatLng[]} waypoints
 * @return {Promise<DirectionsResponseData>}
 */
const getDirections = async (
  origin: string,
  destination: string,
  waypoints: LatLng[]
): Promise<DirectionsResponseData> => {
  return await googleMapsClient
    .directions({
      params: {
        origin,
        destination,
        waypoints,
        key: process.env.GOOGLE_MAPS_BACKEND_KEY || '',
        mode: TravelMode.driving
      }
    })
    .then((response: DirectionsResponse) => {
      return response.data
    })
}

/**
 * Get snapped points from Google
 * @param {Point[]} points
 * @returns Promise returning an array of snapped points
 */
const getSnappedPoints = async (points: Point[]): Promise<Point[]> => {
  let pointsRemaining = points.length, // Make API call every 100 points
    route: Point[] = [],
    apiCalls: number = 0,
    path: string = ''

  while (pointsRemaining > 0) {
    // Beginning and end indexes for points in route array
    const minRouteIndex: number = apiCalls * 100, // 100 slots for each call that has already been made
      maxRouteIndex: number = minRouteIndex + 100 // 100 more than the minimum

    for (let i = minRouteIndex; i < maxRouteIndex; i++) {
      const currentPoint = points[i]
      if (currentPoint == undefined) break // End loop if there is no current point
      path += currentPoint.latitude + ',' + currentPoint.longitude + '|' // Add current point coordinates to path string
    }

    path = path.slice(0, -1)

    const url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`,
      response: AxiosResponse = await axios.get(url),
      snappedPoints = response.data.snappedPoints

    if (!snappedPoints) {
      return []
    }

    // Loop through all snapped points and add them to corrected route array
    for (let i = 0; i < snappedPoints.length; i++) {
      const p = snappedPoints[i].location
      route.push(new Point(p.latitude, p.longitude))
    }

    pointsRemaining -= 100
    apiCalls++
    path = ''
  }
  return route
}

export {getDirections, getSnappedPoints}
