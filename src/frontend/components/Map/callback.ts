// Define external variables in stringified function so VSCode doesn't throw errors
let google: any
let document: any
let center: string
let zoom: number
let points: any

/**
 *
 * This function isn't meant for execution in the backend. It just
 * gets stringified and injected into the HTML as vanilla javascript.
 *
 * This is a hacky way to run it client side because we
 * are server side rendering with react.
 */
export function callback() {
  let map

  map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom
  })

  function createMarker(point) {
    const marker = new google.maps.Marker({
      position: {
        lat: point.location.latitude,
        lng: point.location.longitude
      },
      map
    })

    const infowindow = new google.maps.InfoWindow({
      content: JSON.stringify(point.panoramaText)
    })

    marker.addListener('mouseover', () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: true
      })
    })

    marker.addListener('mouseout', () => {
      infowindow.close()
    })
  }

  function triggerPointPlotting() {
    // console.log('Plotting points...')

    let index = 0
    let length = points.length

    plotPoint()

    function plotPoint() {
      if (index < length) {
        const point = points[index]

        // console.log(`Plotting point at: ${JSON.stringify(point.location)}`)
        createMarker(points[index])
        index++

        setTimeout(() => {
          plotPoint()
        }, 200)
      }
    }
  }

  document.addEventListener('scroll', checkToPlotPoints)

  function checkToPlotPoints() {
    var currentScrollY = window.scrollY
    var mapHeightY = document.getElementById('map').scrollHeight

    if (currentScrollY > mapHeightY) {
      triggerPointPlotting()

      document.removeEventListener('scroll', checkToPlotPoints)
    }
  }
}
