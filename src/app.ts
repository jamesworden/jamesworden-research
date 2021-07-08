import {
  DirectionsProvider,
  OcrProvider,
  PanoramaImageProvider,
  googleCloudVision,
  googleMaps,
  googleStreetView
} from './provider'
import {PointFactory, RouteFactory} from './model'
import express, {Express} from 'express'
import {reportRouter, routeRouter, viewRouter} from './controller'

import {__prod__} from './config'
import path from 'path'
import {pointRouter} from './controller/api'

class App {
  directionsProvider: DirectionsProvider = googleMaps
  panoramaImageProvider: PanoramaImageProvider = googleStreetView
  ocrProvider: OcrProvider = googleCloudVision
  routeFactory: RouteFactory
  pointFactory: PointFactory
  server: Express
  port: number
  env: string

  constructor() {
    this.initServer()

    this.env = __prod__ ? 'prod' : 'dev'
    this.port = 3000

    this.routeFactory = new RouteFactory(this.directionsProvider)

    this.pointFactory = new PointFactory(
      this.panoramaImageProvider,
      this.ocrProvider
    )
  }

  initServer(fileType = 'js') {
    this.server = express()
    this.server.set('views', path.join(__dirname, '/frontend/views'))
    this.server.set('view engine', fileType)

    this.server.engine(fileType, require('express-react-views').createEngine())

    this.server.use('/api/v1/report', reportRouter)
    this.server.use('/api/v1/route', routeRouter)
    this.server.use('/api/v1/point', pointRouter)
    this.server.use('/', viewRouter)
  }

  run() {
    this.server.listen(this.port, () => {
      console.log(`Application running in ${this.env} on port ${this.port}`)
    })
  }
}

const app = new App()

export {app}
