// Define external variables in stringified function so VSCode doesn't throw errors
let google: any
let document: any

/** Injected */
export function init({
  route,
  detour,
  region,
  points,
  center,
  zoom,
  mapId
}): void {
  let map

  map = new google.maps.Map(document.getElementById(mapId), {
    center,
    zoom
  })

  if (region) {
    let regionCoords: any = []

    for (let point of region.points) {
      createMarker(point, 'blue')
      regionCoords.push({
        lat: point.location.latitude,
        lng: point.location.longitude
      })
    }

    const mapRegion = new google.maps.Polygon({
      paths: regionCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    })

    mapRegion.setMap(map)
  }

  if (route) {
    for (let point of route.points) {
      createMarker(point, 'green')
    }
  }

  if (detour) {
    for (let point of detour.points) {
      createMarker(point, 'red')
    }
  }

  if (points) {
    for (let point of points) {
      createMarker(point, 'yellow')
    }
  }

  function createMarker(point, color) {
    const marker = new google.maps.Marker({
      position: {
        lat: point.location.latitude,
        lng: point.location.longitude
      },
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      map
    })

    addInfoWindow(marker, `<pre>${JSON.stringify(point, null, 2)}</pre>`)
  }

  function addInfoWindow(marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content
    })

    // Map view info window
    marker.addListener('click', () => {
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: true
      })
    })

    // Street view info window
    marker.addListener('click', function () {
      let streetViewPanorama = map.getStreetView()

      if (streetViewPanorama.getVisible() == true) {
        infoWindow.open(streetViewPanorama)
        return
      }

      infoWindow.open(map)
    })
  }

  const styles = {
    default: [],
    hide: [
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.icon',
        stylers: [{visibility: 'off'}]
      }
    ]
  }

  map.setOptions({styles: styles['hide']})
}
