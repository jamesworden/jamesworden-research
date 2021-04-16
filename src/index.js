/**
 * App configuration
 * @author James Worden
 */

const express = require('express');
const path = require('path');
const ejs = require('ejs');

// Import routes
const frontendRoutes = require('./frontend/routes'); // Get routes of type route
const routeRoutes = require('./route/routes'); // Get routes of type route

const app = express(); // Create express app

// Set path for EJS views
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/frontend/views'));

// Routing
// app.use('/api/validate', routeRoutes);
app.use('/api/route', routeRoutes);
app.use('/', frontendRoutes);

module.exports = app; // Export app
