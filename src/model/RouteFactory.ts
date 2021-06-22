import { LatLngLiteralVerbose } from '@googlemaps/google-maps-services-js'
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions';
import { Option } from './Route'

class RouteFactory {

  directionsService: DirectionsService
  imageService: ImageService
  ocrService: OcrService

  constructor(directionsService: DirectionsService, imageService: ImageService, ocrService: OcrService) {
    // DirectionsService
    //  Points from polyline
    //  Getting snapped points
    // Street View Imagery service
    // OCR Service
  }

  createRoute(origin: string, destination: string, waypointString: string, options: Option[]) {
  // Rely on directions service
  // Rely on location fetcher from polyline
  // Rely on getting snapped points
  // Streetview service
  // Cloudvision service

  const waypoints: LatLngLiteralVerbose[] = createWaypoints(waypointString);

  const directions: Directions = this.directionsService.getDirections(origin, destination, waypoints)

  const data: DirectionsResponseData = await googleMapsService.getDirections(
    origin,
    destination,
    this.waypoints
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

  const route: DirectionsRoute = data.routes[0]

  this.distance = DataProcessing.getDistance(route)

  const numPoints: number = this.distance / this.increment

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
  })
  await Promise.all(optionPromises)
  return this
}

}

private createWaypoints = (input: string): boolean => {
  this.waypoints = [] // Default value

  // Falsey value or whitespace only
  if (!input || input.trim() === '') {
    return true
  }

  const locationStrings: string[] = input!.split('|')

  if (locationStrings.length > MAX_WAYPOINTS_PER_ROUTE) {
    this.status = Status.TOO_MANY_WAYPOINTS
    return false
  }

  let locations: LatLngLiteralVerbose[] = []

  locationStrings.forEach((locationString: string) => {
    let latLng: string[] = locationString.split(',')

    if (latLng.length != 2) {
      this.status = Status.INVALID_WAYPOINT_FORMAT
      return false
    }

    const latitude: number = parseInt(latLng[0])
    const longitude: number = parseInt(latLng[1])

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      this.status = Status.INVALID_WAYPOINT_VALUES
      return false
    }

    locations.push({
      latitude,
      longitude
    })
  })

  return true
}
}

export const routeFactory = new RouteFactory()
