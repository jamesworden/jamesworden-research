"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HomeController_1 = require("./controller/HomeController");
var ReportController_1 = require("./controller/ReportController");
var RouteController_1 = require("./controller/RouteController");
/**
 * App configuration
 * @author James Worden
 */
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var app = express(); // Create express app
app.engine('html', ejs.renderFile); // Change EJS to HTML file extension
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../views')); // Set path for EJS views
app.use('/api/report', ReportController_1.default);
app.use('/api/route', RouteController_1.default);
app.use('/', HomeController_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map