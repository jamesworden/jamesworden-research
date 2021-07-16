import * as React from 'react'

import {GOOGLE_MAPS_FRONTEND_KEY} from '../../environment-variables'
import {Point} from '../../../model'
import Safe from 'react-safe'
import {callback} from './callback'

interface Map {
  points: Point[]
}

const mapStyles: React.CSSProperties = {
  width: '100%',
  height: '500px'
}

export const Map: React.FC<Map> = ({points}) => {
  /**
   *
   * @returns string to be injected into the HTML javascript
   */
  const center = (): string => {
    const index = Math.floor(points.length / 2)
    const midpoint = points[index].location

    return `{ lat: ${midpoint.latitude}, lng: ${midpoint.longitude} }`
  }

  const zoom: number = 18

  function injectPoints() {
    return (
      <Safe.script>{`const points = ${JSON.stringify(points)}\n`}</Safe.script>
    )
  }

  function injectCenter() {
    return <Safe.script>{`const center = ${center()}\n`}</Safe.script>
  }

  function injectZoom() {
    return <Safe.script>{`const zoom = ${zoom}\n`}</Safe.script>
  }

  function injectCallback() {
    return <Safe.script>{callback.toString()}</Safe.script>
  }

  return (
    <div style={mapStyles} id="map">
      <Safe.script
        async
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_FRONTEND_KEY}&callback=${callback.name}`}></Safe.script>
      {injectPoints()}
      {injectCenter()}
      {injectZoom()}
      {injectCallback()}
    </div>
  )
}
