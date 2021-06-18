import * as GoogleMaps from '../../../../src/util/google/GoogleMaps'

import {Point} from '../../../../src/model/Point'

describe('All functions to get snapped points', () => {
  const points: Point[] = [
    new Point(40, -70.3),
    new Point(40.0000000001, -70.3000001),
    new Point(40.000000002, -70.3000002)
  ]

  test('Returns data', async () => {
    const snappedPoints: Point[] = await GoogleMaps.getSnappedPoints(points)
    expect(snappedPoints).toBeDefined()
  })
})
