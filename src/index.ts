import {APIGatewayProxyEvent, Context} from 'aws-lambda'
import express, {Express} from 'express'

import ImageController from './controller/ImageController'
import ReportContoller from './controller/ReportController'
import RouteContoller from './controller/RouteController'
import {RouteFactory} from './model/RouteFactory'
import ViewContoller from './controller/ViewController'
import awsServerlessExpress from 'aws-serverless-express'
import {googleCloudVision} from './provider/GoogleCloudVision'
import {googleMaps} from './provider/GoogleMaps'
import {googleStreetView} from './provider/GoogleStreetView'
import path from 'path'

class App {
  routeFactory: RouteFactory
  expressApp: Express

  constructor() {
    this.expressApp = express()

    this.expressApp.set('views', path.join(__dirname, '/frontend/views'))
    this.expressApp.set('view engine', 'js')
    this.expressApp.engine('js', require('express-react-views').createEngine())

    this.expressApp.use('/api/image', ImageController)
    this.expressApp.use('/api/report', ReportContoller)
    this.expressApp.use('/api/route', RouteContoller)
    this.expressApp.use('/', ViewContoller)

    this.routeFactory = new RouteFactory(
      googleMaps,
      googleStreetView,
      googleCloudVision
    )
  }
}

const app = new App()

function handler(event: APIGatewayProxyEvent, context: Context) {
  awsServerlessExpress.proxy(
    awsServerlessExpress.createServer(app.expressApp),
    event,
    context
  )
}

export {handler, app}
