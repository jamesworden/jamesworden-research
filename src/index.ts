import HomeContoller from './controller/HomeController';
import ReportContoller from './controller/ReportController';
import RouteContoller from './controller/RouteController';
import constants from './config/Constants';
import express from 'express';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());

app.use('/api/report', ReportContoller);
app.use('/api/route', RouteContoller);
app.use('/', HomeContoller);

const handler = () => {
	// app.listen(constants.PORT, () => {
	// 	console.log(`Development server starting on port ${constants.PORT}`);
	// });
	const response = {
		statusCode: 200,
		body: JSON.stringify('Hello world'),
	};
};

if (!constants.__prod__) {
	handler();
}

export { handler };
