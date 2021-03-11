// Created by James Worden
// GitHub: jamesworden

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const { routes: routeRoutes } = require('./route/routes'); // Get routes of type route

// Create express app
const app = express();

// Initialize middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/route', routeRoutes);

// Export app
module.exports = app;
