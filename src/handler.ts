import {APIGatewayProxyEvent, Context} from 'aws-lambda'

import {app} from './app'
import awsServerlessExpress from 'aws-serverless-express'

function handler(event: APIGatewayProxyEvent, context: Context) {
  awsServerlessExpress.proxy(
    awsServerlessExpress.createServer(app.server),
    event,
    context
  )
}

export {handler}
