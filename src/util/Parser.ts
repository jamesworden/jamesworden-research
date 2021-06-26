import {Response, Status} from './Status'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {MAX_WAYPOINTS_PER_ROUTE} from 'src/config/Constants'

type WaypointData = {
  waypoints: LatLngLiteralVerbose[]
}

class Parser {
  parseWaypointString(input: string): Response<WaypointData> {
    if (!input || input.trim() === '') {
      return {
        data: {
          waypoints: []
        },
        status: Status.OK
      }
    }

    const locationStrings: string[] = input!.split('|')

    if (locationStrings.length > MAX_WAYPOINTS_PER_ROUTE) {
      return {
        error: 'There were too many waypoints in your request!',
        status: Status.INTERNAL_ERROR
      }
    }

    let waypoints: LatLngLiteralVerbose[] = []

    locationStrings.forEach((locationString: string) => {
      let latLng: string[] = locationString.split(',')

      if (latLng.length != 2) {
        return {
          error:
            "Invalid waypoint format. Try this: 'latitude1,longitude1|latitude2,longitude2|...'",
          status: Status.INTERNAL_ERROR
        }
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
        return {
          error:
            'Invalid waypoint values. Please use valid latitude and longitude coordinates.',
          status: Status.INTERNAL_ERROR
        }
      }

      waypoints.push({
        latitude,
        longitude
      })
    })

    return {
      data: {
        waypoints
      },
      status: Status.OK
    }
  }
}

const parser = new Parser()

export {parser, WaypointData}
