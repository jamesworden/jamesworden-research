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
  increment: number
  status: Status
  distance: number
  points: Point[]
  waypoints: Point[] | string // string gets built into point array
  options: Option[]

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
      this.waypoints as string
    )

    // Waypoints will be a string when parsing the input threw an error
    if (typeof waypoints == 'string') {
      this.waypoints = waypoints
      waypoints = [] // Set to empty array for getting data below
    }

    const data: DirectionsResponseData = await GoogleMaps.getDirections(
      this.origin,
      this.destination,
      waypoints
    )

    if (data.status != 'OK') {
      if (data.status == 'NOT_FOUND') {
        this.status = Status.ROUTE_NOT_FOUND
      } else {
        this.status = Status.INTERNAL_ERROR
      }
      return this
    }

    this.distance = await GoogleDataProcessing.getDistance(data.routes[0].legs)

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
      this.status = Status.INTERNAL_ERROR
      return this
    }

    this.points = await GoogleMaps.getSnappedPoints(points)

    if (this.points.length <= 0) {
      this.status = Status.INTERNAL_ERROR
    }

    if (options.length <= 0) {
      return this
    }

    this.options = options

    const optionPromises: Promise<any>[] = []

    this.points.forEach(point => {
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
              .then(base64 => {
                return GoogleCloudVision.getTextFromBase64(base64)
              })
              .then(textArray => {
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
  EXCEEDED_MAXIMUM_DISTANCE = 'The specified route is too long!'
}

export enum Option {
  PANORAMA_TEXT = 'panoramaText',
  PANORAMA_ID = 'panoramaId'
}
