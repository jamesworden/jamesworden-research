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

  constructor() {
    const server: Express = express()

    server.set('views', path.join(__dirname, '/frontend/views'))
    server.set('view engine', 'js')

    server.engine('js', require('express-react-views').createEngine())

    server.use('/api/v1/report', reportRouter)
    server.use('/api/v1/route', routeRouter)
    server.use('/api/v1/point', pointRouter)

    server.use('/', viewRouter)

    this.routeFactory = new RouteFactory(this.directionsProvider)

    this.pointFactory = new PointFactory(
      this.panoramaImageProvider,
      this.ocrProvider
    )

    this.server = server
    this.port = 3000
  }

  run(port?: number) {
    let env: string = this.getEnvironmentString()

    this.server.listen(port, () => {
      console.log(`Application running in ${env} on port ${port || this.port}`)
    })
  }

  getEnvironmentString(): string {
    return __prod__ ? 'production' : 'development'
  }
}

const app = new App()

export {app}
