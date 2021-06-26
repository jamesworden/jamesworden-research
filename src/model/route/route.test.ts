import {Route} from './route'

describe('Point methods', () => {
  it('Add panorama text', () => {
    const route: Route = new Route('origin', 'destination', [], 10, 0)
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
