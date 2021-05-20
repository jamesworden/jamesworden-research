"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var app_1 = require("./src/app");
var awsServerlessExpress = require('aws-serverless-express');
var server = awsServerlessExpress.createServer(app_1.default);
var handler = function (event, context) {
    return awsServerlessExpress.proxy(server, event, context);
};
exports.handler = handler;
//# sourceMappingURL=handler.js.map