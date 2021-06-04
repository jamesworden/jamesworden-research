import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import HomeContoller from './controller/HomeController';
import ReportContoller from './controller/ReportController';
import RouteContoller from './controller/RouteController';
import awsServerlessExpress from 'aws-serverless-express';
import constants from './config/Constants';
import express from 'express';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/report', ReportContoller);
app.use('/api/route', RouteContoller);
app.use('/', HomeContoller);

if (!constants.__prod__) {
	app.listen(constants.PORT, () => {
		console.log(`Development server starting on port ${constants.PORT}`);
	});
}

const handler = (event: APIGatewayProxyEvent, context: Context) =>
	awsServerlessExpress.proxy(awsServerlessExpress.createServer(app), event, context);

export { handler };
