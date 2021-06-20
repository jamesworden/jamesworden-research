import {
  Client,
  LatLng,
  SnapToRoadsResponse,
  TravelMode
} from '@googlemaps/google-maps-services-js'
import {
  DirectionsResponse,
  DirectionsResponseData
} from '@googlemaps/google-maps-services-js/dist/directions'

import {Location} from '../model/Location'

class GoogleMapsService {
  private key: string
  private client: Client

  constructor() {
    this.key = process.env.GOOGLE_MAPS_BACKEND_KEY as string
    this.client = new Client()
  }

  getDirections = async (
    origin: string,
    destination: string,
    waypoints: LatLng[]
  ): Promise<DirectionsResponseData> => {
    return await this.client
      .directions({
        params: {
          origin,
          destination,
          waypoints,
          key: this.key,
          mode: TravelMode.driving
        }
      })
      .then((response: DirectionsResponse) => {
        return response.data
      })
  }

  getSnappedPoints = async (points: Location[]): Promise<Location[]> => {
    return await this.client
      .snapToRoads({
        params: {
          path: points,
          key: this.key
        }
      })
      .then((response: SnapToRoadsResponse) => {
        let locations: Location[] = []

        response.data.snappedPoints.forEach((snappedPoint) => {
          locations.push(snappedPoint.location)
        })

        return locations
      })
  }
}

export const googleMapsService = new GoogleMapsService()
