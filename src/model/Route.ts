import * as DataProcessing from '../util/DataProcessing'

import {DirectionsResponseData} from '@googlemaps/google-maps-services-js/dist/directions'
import {DirectionsRoute} from '@googlemaps/google-maps-services-js'
import {Location} from '../model/Location'
import {MAX_POINTS_PER_ROUTE} from '../config/Constants'
import {Point} from '../model/Point'
import {Waypoints} from '../model/Waypoints'
import {googleCloudVisionService} from '../service/GoogleCloudVisionService'
import {googleMapsService} from '../service/GoogleMapsService'
import {googleStreetViewService} from '../service/GoogleStreetViewService'

export class Route {
  origin: string
  destination: string
  waypoints: Waypoints
  distance: number
  increment: number
  status: Status
  points: Point[]
  options?: Option[]

  constructor(
    origin: string,
    destination: string,
    increment: number,
    waypoints?: string
  ) {
    this.origin = origin
    this.destination = destination
    this.increment = increment
    this.points = []
    this.status = Status.NOT_INITALIZED
    this.waypoints = new Waypoints(waypoints)
  }

  // Build the route and inject it into the 'points' member variable
  async build(options: Option[] = []): Promise<this> {
    const data: DirectionsResponseData = await googleMapsService.getDirections(
      this.origin,
      this.destination,
      this.waypoints.locations
    )

    // Todo: add logging function for when the status is INTERNAL ERROR
    if (data.status != 'OK') {
      if (data.status == 'NOT_FOUND' || data.status == 'ZERO_RESULTS') {
        this.status = Status.ROUTE_NOT_FOUND
      } else {
        this.status = Status.INTERNAL_ERROR
      }
      return this
    }

    let route: DirectionsRoute = data.routes[0]

    this.distance = DataProcessing.getDistance(route)

    var numPoints: number = this.distance / this.increment

    if (numPoints > MAX_POINTS_PER_ROUTE) {
      this.status = Status.EXCEEDED_MAXIMUM_DISTANCE
      return this
    }

    const points: Location[] = DataProcessing.getLocations(
      data.routes[0].overview_polyline.points,
      this.increment
    )

    if (points.length <= 0) {
      this.status = Status.ERROR_FETCHING_DIRECTIONS
      return this
    }

    // Todo: add logging function for when there is an error
    const snappedPoints: Location[] = await googleMapsService
      .getSnappedPoints(points)
      .catch(() => {
        this.status = Status.ERROR_SNAPPING_POINTS
        return []
      })

    this.status = Status.OK

    if (options.length <= 0) {
      return this
    }

    this.options = options
    const optionPromises: Promise<any>[] = []

    // Create new points for each location
    snappedPoints.forEach((point) => {
      this.points.push(new Point(point.latitude, point.longitude))
    })

    this.points.forEach((point) => {
      const location = point.location

      if (options.includes(Option.PANORAMA_ID)) {
        optionPromises.push(
          googleStreetViewService
            .getPanoramaId(location.latitude, location.longitude)
            .then((pano_id: string) => {
              point.panoramaId = pano_id
            })
            .catch((err) => {
              // Todo: logging functionality
              console.log(`Error fetching panorama id  \n ${err}`)
              return
            })
        )
      }

      if (options.includes(Option.PANORAMA_TEXT)) {
        // Gather text from three different images to simulate a panorama image
        for (let heading = 0; heading < 360; heading += 120) {
          optionPromises.push(
            googleStreetViewService
              .getPanoramaImage(location.latitude, location.longitude, heading)
              .then((base64: string) => {
                return googleCloudVisionService.getTextFromImage(base64)
              })
              .then((textArray) => {
                point.addPanoramaText(textArray)
              })
              .catch((err) => {
                // Todo: logging functionality
                console.log(`Error fetching panorama text  \n ${err}`)
                return
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
  ERROR_SNAPPING_POINTS = 'We were unable to snap your points to nearby roads!'
}

export enum Option {
  PANORAMA_TEXT = 'PANORAMA_TEXT',
  PANORAMA_ID = 'PANORAMA_ID'
}
