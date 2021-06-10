import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { PORT, __prod__ } from './config/Constants';

import ImageController from './controller/ImageController';
import ReportContoller from './controller/ReportController';
import RouteContoller from './controller/RouteController';
import ViewContoller from './controller/ViewController';
import awsServerlessExpress from 'aws-serverless-express';
import express from 'express';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, '/frontend/views'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());

app.use('/api/image', ImageController);
app.use('/api/report', ReportContoller);
app.use('/api/route', RouteContoller);
app.use('/', ViewContoller);

export const handler = (event: APIGatewayProxyEvent, context: Context) =>
	awsServerlessExpress.proxy(awsServerlessExpress.createServer(app), event, context);
