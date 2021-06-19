let data = require('../../json/DirectionsResponseData.json')

import * as GoogleDataProcessing from '../../../../src/util/google/GoogleDataProcessing'

import {Point} from '../../../../src/model/Point'

test('Get distance from legs', () => {
  const distance: number = GoogleDataProcessing.getDistance(data.routes[0])
  expect(distance).toEqual(152) // As defined in the json file
})

test('Get points from polyline', () => {
  let points: Point[] = GoogleDataProcessing.getPoints(
    data.routes[0].overview_polyline.points,
    5
  )

  points.forEach((p) => {
    expect(p.latitude).toBeLessThanOrEqual(90)
    expect(p.latitude).toBeGreaterThanOrEqual(-90)
    expect(p.longitude).toBeLessThanOrEqual(180)
    expect(p.longitude).toBeGreaterThanOrEqual(-180)
  })
})
