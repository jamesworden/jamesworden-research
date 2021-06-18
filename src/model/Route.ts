import * as GoogleCloudVision from '../util/google/GoogleCloudVision'
import * as GoogleDataProcessing from '../util/google/GoogleDataProcessing'
import * as GoogleMaps from '../util/google/GoogleMaps'
import * as GoogleStreetView from '../util/google/GoogleStreetView'

import {DirectionsResponseData} from '@googlemaps/google-maps-services-js/dist/directions'
import {LatLng} from '@googlemaps/google-maps-services-js'
import {MAX_POINTS_PER_ROUTE} from '../config/Constants'
import {Point} from '../model/Point'

export class Route {
  origin: string
  destination: string
  waypoints: string // if invalid input, value becomes error
  distance: number
  increment: number
  status: Status
  options: Option[]
  points: Point[]

  constructor(
    origin: string,
    destination: string,
    increment: number,
    waypoints: string
  ) {
    this.origin = origin
    this.destination = destination
    this.increment = increment
    this.waypoints = waypoints
    this.status = Status.NOT_INITALIZED
    this.points = []
  }

  // Create the route and inject it into the 'route' member variable
  async build(options: Option[] = []): Promise<this> {
    var waypoints: LatLng[] | string = GoogleDataProcessing.getWaypoints(
      this.waypoints
    )

    if (typeof waypoints == 'string') {
      this.waypoints = waypoints // Set value equal to returned status
      waypoints = []
    }

    const data: DirectionsResponseData = await GoogleMaps.getDirections(
      this.origin,
      this.destination,
      waypoints
    )

    if (data.status != 'OK') {
      if (data.status == 'NOT_FOUND') {
        this.status = Status.ROUTE_NOT_FOUND
      } else if (data.status == 'ZERO_RESULTS') {
        this.status = Status.ZERO_RESULTS
      } else {
        console.log(data.status)
        this.status = Status.INTERNAL_ERROR
      }
      return this
    }

    this.distance = await GoogleDataProcessing.getDistance(data.routes[0])

    var numPoints: number = this.distance / this.increment

    if (numPoints > MAX_POINTS_PER_ROUTE) {
      this.status = Status.EXCEEDED_MAXIMUM_DISTANCE
      return this
    }

    const points: Point[] = GoogleDataProcessing.getPoints(
      data.routes[0].overview_polyline.points,
      this.increment
    )

    if (points.length <= 0) {
      this.status = Status.ERROR_FETCHING_DIRECTIONS
      return this
    }

    this.points = await GoogleMaps.getSnappedPoints(points)

    if (this.points.length <= 0) {
      this.status = Status.ERROR_SNAPPING_POINTS
    }

    this.status = Status.OK

    if (options.length <= 0) {
      return this
    }

    this.options = options

    const optionPromises: Promise<any>[] = []

    this.points.forEach((point) => {
      if (options.includes(Option.PANORAMA_ID)) {
        optionPromises.push(
          GoogleStreetView.getPanoramaId(point).then((pano_id: string) => {
            point.panoramaId = pano_id
          })
        )
      }

      if (options.includes(Option.PANORAMA_TEXT)) {
        // Gather text from three different images to simulate a panorama image
        for (let heading = 0; heading < 360; heading += 120) {
          optionPromises.push(
            GoogleStreetView.getPanoramaBase64(point, heading)
              .then((base64) => {
                return GoogleCloudVision.getTextFromBase64(base64)
              })
              .then((textArray) => {
                point.addPanoramaText(textArray)
              })
          )
        }
      }
    })
    await Promise.all(optionPromises)
    return this
  }

  getPoints(): Point[] {
    return this.points
  }
}

export enum Status {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request!',
  ROUTE_NOT_FOUND = 'The specified route could not be found!',
  NOT_INITALIZED = 'The route has not been initalized yet.',
  EXCEEDED_MAXIMUM_DISTANCE = 'The specified route is too long!',
  ERROR_FETCHING_DIRECTIONS = 'We were unable to fetch the data from Google!',
  ERROR_SNAPPING_POINTS = 'We were unable to snap your points to nearby roads!',
  ZERO_RESULTS = 'No results were found for you request.'
}

export enum Option {
  PANORAMA_TEXT = 'PANORAMA_TEXT',
  PANORAMA_ID = 'PANORAMA_ID'
}
