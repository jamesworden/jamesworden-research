import {
  Client,
  LatLng,
  LatLngLiteralVerbose,
  SnapToRoadsResponse,
  TravelMode
} from '@googlemaps/google-maps-services-js'
import {
  DirectionsResponse,
  DirectionsResponseData
} from '@googlemaps/google-maps-services-js/dist/directions'

class GoogleMapsService {
  private apiKey: string
  private client: Client

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_BACKEND_KEY as string
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
          key: this.apiKey,
          mode: TravelMode.driving
        }
      })
      .then((response: DirectionsResponse) => {
        return response.data
      })
  }

  getSnappedPoints = async (
    points: LatLngLiteralVerbose[]
  ): Promise<LatLngLiteralVerbose[]> => {
    return await this.client
      .snapToRoads({
        params: {
          path: points,
          key: this.apiKey
        }
      })
      .then((response: SnapToRoadsResponse) => {
        let locations: LatLngLiteralVerbose[] = []

        response.data.snappedPoints.forEach((snappedPoint) => {
          locations.push(snappedPoint.location)
        })

        return locations
      })
  }
}

export const googleMapsService = new GoogleMapsService()
