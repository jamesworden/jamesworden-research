import {Failure, isFailure} from '../response-utils'

import {LatLngLiteralVerbose} from '@googlemaps/google-maps-services-js'
import {MAX_WAYPOINTS_PER_ROUTE} from '../../config'
import {parser} from '.'

describe('Parse coordinate string correctly', () => {
  let str: string
  let res: LatLngLiteralVerbose[] | Failure

  it('Valid pair', () => {
    str = '40,-70'
    res = parser.getLocationsFromString(str)

    if (isFailure(res)) {
      return
    }

    expect(res).toStrictEqual([
      {
        latitude: 40,
        longitude: -70
      }
    ])
  })

  it('Invalid pair', () => {
    str = '40,-70,'
    res = parser.getLocationsFromString(str)

    if (isFailure(res)) {
      expect(isFailure(res)).toBe(true)
      expect(res.response.error).toContain('Invalid')
      return
    }
  })

  it('Valid pairs', () => {
    str = '40,-70.01|30.91,0'
    res = parser.getLocationsFromString(str)

    if (isFailure(res)) {
      expect(isFailure(res)).toBe(false)
      return
    }

    expect(res).toStrictEqual([
      {
        latitude: 40,
        longitude: -70.01
      },
      {
        latitude: 30.91,
        longitude: 0
      }
    ])
  })

  it('Invalid pairs', () => {
    str = '40,-70||30.911'
    res = parser.getLocationsFromString(str)

    if (isFailure(res)) {
      expect(isFailure(res)).toBe(true)
      expect(res.response.error).toContain('Invalid')
      return
    }
  })

  it('Too many waypoints', () => {
    const tooMany: number = MAX_WAYPOINTS_PER_ROUTE + 1
    str = ''

    for (let i = 0; i < tooMany; i++) {
      str += '0,0|'
    }

    str = str.substring(0, str.length - 1)
    res = parser.getLocationsFromString(str)

    if (isFailure(res)) {
      expect(isFailure(res)).toBe(true)
      expect(res.response.error).toContain('too many')
      return
    }
  })

  it('Invalid values', () => {
    str = 'value,9'
    res = parser.getLocationsFromString(str)
    expect(isFailure(res)).toBe(true)

    str = '0,900'
    res = parser.getLocationsFromString(str)
    expect(isFailure(res)).toBe(true)

    str = '78,9.32|test,9'
    res = parser.getLocationsFromString(str)
    expect(isFailure(res)).toBe(true)

    str = '-91,3|3,181'
    res = parser.getLocationsFromString(str)
    expect(isFailure(res)).toBe(true)

    str = '91,3|3,-181'
    res = parser.getLocationsFromString(str)
    expect(isFailure(res)).toBe(true)
  })
})
