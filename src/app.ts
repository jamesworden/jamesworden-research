import {
  DirectionsProvider,
  OcrProvider,
  PanoramaImageProvider,
  googleCloudVision,
  googleMaps,
  googleStreetView
} from './provider'
import {PointFactory, RouteFactory} from './model'
import {
  docsRouter,
  homeRouter,
  mapRouter,
  pointRouter,
  reportRouter,
  routeRouter
} from './controller'
import express, {Express} from 'express'

import {__prod__} from './config'
import path from 'path'

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
    this.server.use('/docs', docsRouter)
    this.server.use('/map', mapRouter)
    this.server.use('/', homeRouter)
  }
}

const app = new App()

export {app}
