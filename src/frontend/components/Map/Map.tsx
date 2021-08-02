import * as React from 'react'

import {Point, Region, Route} from '../../../model'

import {DEFAULT_MAP_CENTER_LOCATION} from '../../../config'
import Safe from 'react-safe'
import {callback} from './callback'

export const GOOGLE_MAPS_FRONTEND_KEY = process.env
  .GOOGLE_MAPS_FRONTEND_KEY as string

interface Map {
  route?: Route
  detour?: Route
  region?: Region
  points?: Point[]
  width?: string
  height?: string
  zoom?: number
}

export const Map: React.FC<Map> = ({
  route,
  detour,
  region,
  points,
  zoom,
  width = '100%',
  height = '32rem'
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

    if (region || detour || route || points) {
      return 16 // If any points are specified, zoom in
    }

    return 4 // No points specified, zoom out
  }

  function injectRoute() {
    return <Safe.script>{`const route = ${JSON.stringify(route)}`}</Safe.script>
  }

  function injectDetour() {
    return (
      <Safe.script>{`const detour = ${JSON.stringify(detour)}`}</Safe.script>
    )
  }

  function injectRegion() {
    return (
      <Safe.script>{`const region = ${JSON.stringify(region)}`}</Safe.script>
    )
  }

  function injectPoints() {
    return (
      <Safe.script>{`const points = ${JSON.stringify(points)}`}</Safe.script>
    )
  }

  function injectCenter() {
    return <Safe.script>{`const center = ${getCenter()}`}</Safe.script>
  }

  function injectZoom() {
    return <Safe.script>{`const zoom = ${getZoom()}`}</Safe.script>
  }

  function injectCallback() {
    return <Safe.script>{callback.toString()}</Safe.script>
  }

  return (
    <div
      style={{
        width,
        height
      }}
      id="map">
      <Safe.script
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_FRONTEND_KEY}&callback=${callback.name}`}></Safe.script>
      {injectRoute()}
      {injectRegion()}
      {injectDetour()}
      {injectPoints()}
      {injectCenter()}
      {injectZoom()}
      {injectCallback()}
      <span>
        <h2>Loading map...</h2>
        {/** This should get overidden when the google maps callback function is executed */}
      </span>
    </div>
  )
}
