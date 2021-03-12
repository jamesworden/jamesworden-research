const awsServerlessExpress = require('aws-serverless-express');
const app = require('./src/index');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
	return awsServerlessExpress.proxy(server, event, context);
};

// Setting up file serving
const StaticFileHandler = require('serverless-aws-static-file-handler');
const path = require('path');
const clientFilesPath = path.join(__dirname, './frontend/');
const fileHandler = new StaticFileHandler(clientFilesPath);

module.exports.html = async (event, context) => {
	event.path = 'index.html'; // forcing a specific page for this handler, ignore requested path. This would serve ./data-files/index.html
	return fileHandler.get(event, context);
};
