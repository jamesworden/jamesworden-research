import express, {Express} from 'express'

import ImageController from './controller/image-controller'
import ReportContoller from './controller/report-controller'
import RouteContoller from './controller/route-controller'
import {RouteFactory} from './model/route/route-factory'
import ViewContoller from './controller/view-controller'
import {googleCloudVision} from './provider/ocr/google-cloud-vision'
import {googleMaps} from './provider/directions/google-maps'
import {googleStreetView} from './provider/panorama-image/google-street-view'
import path from 'path'

class App {
  routeFactory: RouteFactory
  server: Express

  constructor() {
    const server: Express = express()

    server.set('views', path.join(__dirname, '/frontend/views'))
    server.set('view engine', 'js')
    server.engine('js', require('express-react-views').createEngine())

    server.use('/api/image', ImageController)
    server.use('/api/report', ReportContoller)
    server.use('/api/route', RouteContoller)
    server.use('/', ViewContoller)

    this.server = server

    /**
     * Any providers can be injected into this applications route factory.
     * Get directions, street view imagery, and optical character recognition
     * services from using any API - so long as it extends the appropriate
     * provider interface.
     */
    this.routeFactory = new RouteFactory(
      googleMaps,
      googleStreetView,
      googleCloudVision
    )
  }
}

const app = new App()

export {app}
