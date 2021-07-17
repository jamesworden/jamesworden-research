// Define external variables in stringified function so VSCode doesn't throw errors
let google: any
let document: any
let center: string
let zoom: number
let points: any

/** Injected */
export function callback(): void {
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

    // For mobile accessibility
    marker.addListener('click', () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: true
      })

      setTimeout(() => {
        infowindow.close()
      }, 2500)
    })

    marker.addListener('mouseout', () => {
      infowindow.close()
    })
  }

  function triggerPointPlotting() {
    let index = 0
    let length = points.length

    plotPoint()

    function plotPoint() {
      if (index < length) {
        const point = points[index]

        createMarker(point)
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
