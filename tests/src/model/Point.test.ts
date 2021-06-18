import {Point} from '../../../src/model/Point'

describe('Point declaration', () => {
  let latitude: number = 34.0002,
    longitude: number = 34.0001,
    point: Point = new Point(latitude, longitude)

  test('Point object contains appropriate values', () => {
    expect(point).toEqual({
      latitude: 34.0002,
      longitude: 34.0001
    })
  })

  test('Point getters and setters', () => {
    expect(point.panoramaId).toBeUndefined()
    point.panoramaId = 'test'
    expect(point.panoramaId).toEqual('test')
    expect(point.panoramaText).toBeUndefined()
    point.addPanoramaText(['test'])
    expect(point.panoramaText).toEqual(['test'])
    point.addPanoramaText(['test', 'another', 'another1'])
    expect(point.panoramaText).toEqual(['test', 'test', 'another', 'another1'])
  })
})
