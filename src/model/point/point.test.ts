import {Point} from './point'

describe('Point methods', () => {
  it('Add panorama text', () => {
    const point: Point = new Point(40, 40)
    expect(point.panoramaText).toBeUndefined

    point.addPanoramaText(['test'])
    expect(point.panoramaText).toStrictEqual(['test'])

    point.addPanoramaText(['another', 'and another'])
    expect(point.panoramaText).toStrictEqual(['test', 'another', 'and another'])
  })

  /**
   * Totally unnecessary because of how simple this is.
   */
  it('Set panorama id', () => {
    const point: Point = new Point(40, 40)
    expect(point.panoramaId).toBeUndefined

    point.panoramaId = 'Some id'
    expect(point.panoramaId).toStrictEqual('Some id')

    point.panoramaId = 'different id'
    expect(point.panoramaId).toStrictEqual('different id')
  })
})
