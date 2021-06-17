let data = require('../../../src/json/googleDirectionsData.json')

import * as GoogleDataProcessing from '../../../src/util/google/GoogleDataProcessing'

import {Point} from '../../../src/model/Point'
import {decode} from 'polyline'

test('Get distance from legs', () => {
  let legs = data['routes'][0]['legs'],
    distance = GoogleDataProcessing.getDistance(legs)

  expect(distance).toEqual(152)
})

test('Get points from polyline', () => {
  let encodedPolyline: string =
      data['routes'][0]['overview_polyline']['points'],
    decodedPoints: any[] = decode(encodedPolyline)
  expect(typeof decodedPoints[0][0]).toBe('number')
  expect(typeof decodedPoints[0][1]).toBe('number')
  let points: Point[] = GoogleDataProcessing.getPoints(encodedPolyline, 5)
  expect(decodedPoints.length < points.length)
  points.forEach(p => {
    expect(p.latitude).toBeLessThanOrEqual(90)
    expect(p.latitude).toBeGreaterThanOrEqual(-90)
    expect(p.longitude).toBeLessThanOrEqual(180)
    expect(p.longitude).toBeGreaterThanOrEqual(-180)
  })
})
