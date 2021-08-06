import * as React from 'react'

import {Point, Region, Report, Route} from '../../../model'

import {DEFAULT_MAP_CENTER_LOCATION} from '../../../config'
import Safe from 'react-safe'
import {init} from './callback'

interface Map {
  route?: Route
  detour?: Route
  region?: Region
  points?: Point[]
  width?: string
  height?: string
  zoom?: number
  id: string
  report?: Report
}

export const Map: React.FC<Map> = ({
  route,
  detour,
  region,
  points,
  zoom,
  width = '100%',
  height = '32rem',
  id,
  report
}) => {
  function getCenter(): string {
    if (route) {
      return getStringifiedMidpoint(route.points)
    }

    if (detour) {
      return getStringifiedMidpoint(detour.points)
    }

    if (region) {
      return getStringifiedMidpoint(region.points)
    }

    if (points) {
      return getStringifiedMidpoint(points)
    }

    if (report) {
      return getStringifiedMidpoint(report.route.points)
    }

    const {latitude, longitude} = DEFAULT_MAP_CENTER_LOCATION

    return getStringifiedPoint(latitude, longitude)
  }

  function getStringifiedMidpoint(points) {
    const index = Math.floor(points.length / 2)
    const midpoint = points[index].location

    return getStringifiedPoint(midpoint.latitude, midpoint.longitude)
  }

  /**
   *
   * Ensures that the point is stringified as LatLongLiteral format only.
   */
  function getStringifiedPoint(latitude, longitude) {
    return `{ lat: ${latitude}, lng: ${longitude} }` // Injected
  }

  function getZoom(): number {
    if (zoom) {
      return zoom
    }

    if (region || detour || route || points || report) {
      return 17 // If any points are specified, zoom in
    }

    return 4 // No points specified, zoom out
  }

  function injectCallback() {
    return (
      <Safe.script>{`

      ${init.toString()}

      const mapData${id} = {
        route: ${JSON.stringify(route)},
        detour: ${JSON.stringify(detour)},
        region: ${JSON.stringify(region)},
        points: ${JSON.stringify(points)},
        center: ${getCenter()},
        zoom: ${getZoom()},
        mapId: '${id}',
        report: ${JSON.stringify(report)},
      }

      function ${id}() {
        ${init.name}(mapData${id})
      }

    `}</Safe.script>
    )
  }

  return (
    <>
      {injectCallback()}
      <div
        style={{
          width,
          height
        }}
        id={id}>
        <h2>
          Loading map...
          {/** This should get overidden when the google maps callback function is executed */}
        </h2>
      </div>
    </>
  )
}
