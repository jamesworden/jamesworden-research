/**
 * App configuration
 * @author James Worden
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const routeRoutes = require('./route/routes'); // Get routes of type route
const frontendRoutes = require('./frontend/routes'); // Get routes of type route

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set path for EJS views
const { join } = require('path');
app.set('view engine', 'ejs');
app.set('views', join(__dirname, '/frontend/views'));
app.use(express.static(join(__dirname, 'public')));

// Routing
app.use('/route', routeRoutes);
app.use('/', frontendRoutes);

// Export app
module.exports = app;
