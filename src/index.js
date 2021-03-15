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

// EJS for frontend
const path = require('path');
const frontend = path.join(__dirname, '/frontend');
app.set('view engine', 'ejs');
app.set('views', frontend);

// Routing
app.use('/route', routeRoutes);
app.use('/', frontendRoutes);

// Export app
module.exports = app;
