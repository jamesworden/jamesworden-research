import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {coordinateUtils} from './coordinate-utils'

describe('Coordinate Utilities', () => {
  const numArr: number[][] = [
    [40.723478, -73.798441],
    [40.725705, -73.791797],
    [40.723684, -73.790589],
    [40.721405, -73.790297]
  ]

  const latLngArr: LatLngLiteralVerbose[] = coordinateUtils.numToLatLng(numArr)

  it('Convert numbers to Lat Lng types', () => {
    expect(numArr.length).toEqual(latLngArr.length)

    for (let i: number = 0; i < numArr.length; i++) {
      expect(numArr[i][0]).toEqual(latLngArr[i].latitude)
      expect(numArr[i][1]).toEqual(latLngArr[i].longitude)
    }
  })

  it('Get incremental coordinates', () => {
    const inc = 10
    const incCoords: LatLngLiteralVerbose[] =
      coordinateUtils.getIncrementalCoordinates(latLngArr, inc)

    // Points go to the right and upwards on the map (increase in lat and lng)

    expect(incCoords.length).toBeGreaterThan(latLngArr.length)
    expect(incCoords[1].latitude).toBeGreaterThan(latLngArr[0].latitude)
    expect(incCoords[1].longitude).toBeGreaterThan(latLngArr[0].longitude)

    // Points go to the right and downards on the map (increase in lat decrease in lng)

    const lastIncNum: number = incCoords.length - 1
    const latLatLngNum: number = latLngArr.length - 1

    expect(incCoords[lastIncNum].latitude).toBeGreaterThan(
      latLngArr[latLatLngNum].latitude
    )
    expect(incCoords[lastIncNum].longitude).toBeLessThan(
      latLngArr[latLatLngNum].longitude
    )
  })

  it('Increment distance longer than route distance yields appropriate length', () => {
    const increment: number = 100

    const coordinates: LatLngLiteralVerbose[] = [
      {latitude: 40.75809, longitude: -73.99661},
      {latitude: 40.75928, longitude: -73.99573}
    ]

    const incCoords: LatLngLiteralVerbose[] =
      coordinateUtils.getIncrementalCoordinates(coordinates, increment)

    expect(incCoords.length).toBeLessThanOrEqual(coordinates.length)
  })
})
