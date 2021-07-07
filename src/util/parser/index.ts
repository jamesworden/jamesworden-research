import {Failure, HttpStatusCode} from '..'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {isFailure} from '../response-utils'

class Parser {
  getLocationsFromString(input: string): LatLngLiteralVerbose[] | Failure {
    const locationStrings: string[] = input.split(',')

    let locations: LatLngLiteralVerbose[] = []

    for (const locationString of locationStrings) {
      const location: LatLngLiteralVerbose | Failure =
        this.getLocationFromString(locationString)

      if (isFailure(location)) {
        return location
      }

      locations.push(location)
    }

    return locations
  }

  getLocationFromString(
    locationString: string
  ): LatLngLiteralVerbose | Failure {
    const latLngStrings: [string, string] | Failure =
      this.getLatLngStrings(locationString)

    if (isFailure(latLngStrings)) {
      return latLngStrings
    }

    return this.getLocationFromLatLngStrings([
      latLngStrings[0],
      latLngStrings[1]
    ])
  }

  private getLatLngStrings(locationString: string): [string, string] | Failure {
    const latLngStrings: string[] = locationString.split(',')

    if (latLngStrings.length != 2) {
      return {
        response: {
          error: `Invalid waypoint format. Try: 'latitude1,longitude1|latitude2,longitude2|...'`,
          message: `Your input: ${locationString}`
        },
        statusCode: HttpStatusCode.NOT_ACCEPTABLE
      }
    }

    return [latLngStrings[0], latLngStrings[1]]
  }

  private getLocationFromLatLngStrings(latLngStrings: [string, string]) {
    const latitude: number = parseFloat(latLngStrings[0])
    const longitude: number = parseFloat(latLngStrings[1])

    if (this.coordinatesAreInvalid(latitude, longitude)) {
      return {
        response: {
          error: 'Invalid latitude and longitude coordinates.',
          message: `Specified location: ${latitude},${longitude}`
        },
        statusCode: HttpStatusCode.NOT_ACCEPTABLE
      }
    }

    return {
      latitude,
      longitude
    }
  }

  private coordinatesAreInvalid(latitude: number, longitude: number): boolean {
    return (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    )
  }
}

export const parser = new Parser()
