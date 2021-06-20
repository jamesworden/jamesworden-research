import {LatLng} from '@googlemaps/google-maps-services-js'
import {MAX_WAYPOINTS_PER_ROUTE} from '../config/Constants'

export class Waypoints {
  locations: LatLng[]
  status: string

  constructor(input: string | undefined) {
    this.locations = []

    if (!input) {
      this.status = 'There were no specified waypoints!'
    }

    let locationStrings: string[] = input!.split('|')

    if (locationStrings.length > MAX_WAYPOINTS_PER_ROUTE) {
      return {
        locations: [],
        status: `There were too many waypoints specified! (Max: ${MAX_WAYPOINTS_PER_ROUTE})`
      }
    }

    let locations: LatLng[] = []

    locationStrings.forEach((locationString: string) => {
      var latLng: string[] = locationString.split(',')

      if (latLng.length != 2) {
        return `Invalid format. Multiple commas within coordinate pair section: ${locationString}`
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
        return `Invalid coordinates: ${latLng[0]}, ${latLng[1]}`
      }

      locations.push({
        latitude,
        longitude
      })
    })

    return {
      locations,
      status: 'Successfully added waypoints.'
    }
  }
}
