/**
 * App configuration
 * @author James Worden
 */

const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express(); // Create express app

app.engine('html', ejs.renderFile); // Change EJS to HTML file extension
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/frontend/views')); // Set path for EJS views

app.use('/api/report', require('./report/routes'));
app.use('/api/route', require('./route/routes'));
app.use('/', require('./frontend/routes'));

module.exports = app; // Export app
