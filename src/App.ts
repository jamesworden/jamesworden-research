import homeController from './controller/HomeController';
import reportController from './controller/ReportController';
import routeController from './controller/RouteController';

/**
 * App configuration
 * @author James Worden
 */

let express = require('express');
let path = require('path');
let ejs = require('ejs');

let app = express(); // Create express app

app.engine('html', ejs.renderFile); // Change EJS to HTML file extension
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../views')); // Set path for EJS views

app.use('/api/report', reportController);
app.use('/api/route', routeController);
app.use('/', homeController);

export default app;
