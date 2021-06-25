import {LatLngLiteralVerbose, Status} from '@googlemaps/google-maps-services-js'

import {MAX_WAYPOINTS_PER_ROUTE} from 'src/config/Constants'

type WaypointStringResponse = {
  data?: {
    waypoints: LatLngLiteralVerbose[]
  }
  status: WaypointStringStatus
}

enum WaypointStringStatus {
  OK = 'Success!',
  TOO_MANY_WAYPOINTS = 'There were too many waypoints in your request!',
  INVALID_WAYPOINT_FORMAT = "Invalid waypoint format. Try this: 'latitude1,longitude1|latitude2,longitude2|...'",
  INVALID_WAYPOINT_VALUES = 'Invalid waypoint values. Please use valid latitude and longitude coordinates.'
}

class Parser {
  parseWaypointString(input: string): WaypointStringResponse {
    if (!input || input.trim() === '') {
      return {
        status: WaypointStringStatus.OK
      }
    }

    const locationStrings: string[] = input!.split('|')

    if (locationStrings.length > MAX_WAYPOINTS_PER_ROUTE) {
      return {
        status: WaypointStringStatus.TOO_MANY_WAYPOINTS
      }
    }

    let waypoints: LatLngLiteralVerbose[] = []

    locationStrings.forEach((locationString: string) => {
      let latLng: string[] = locationString.split(',')

      if (latLng.length != 2) {
        return {
          status: WaypointStringStatus.INVALID_WAYPOINT_FORMAT
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
          status: WaypointStringStatus.INVALID_WAYPOINT_VALUES
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
      status: WaypointStringStatus.OK
    }
  }
}

const parser = new Parser()

export {parser, WaypointStringStatus, WaypointStringResponse}
