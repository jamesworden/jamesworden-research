import * as React from 'react'

import Safe from 'react-safe'

const GOOGLE_MAPS_FRONTEND_KEY = process.env.GOOGLE_MAPS_FRONTEND_KEY as string

interface MapLoader {
  mapIds: string[]
}

export const MapLoader: React.FC<MapLoader> = ({mapIds}) => {
  const callbackFunctionName = 'callback'

  function injectCallback() {
    return (
      <Safe.script>{`
    
      function ${callbackFunctionName}() {
        const mapIds = ${JSON.stringify(mapIds)}

        mapIds.forEach((id) => {
          eval(id)()
        })
      }
    
    `}</Safe.script>
    )
  }

  return (
    <>
      {injectCallback()}
      <Safe.script
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_FRONTEND_KEY}&callback=${callbackFunctionName}`}
      />
    </>
  )
}
