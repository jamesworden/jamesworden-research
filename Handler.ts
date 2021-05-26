import app from './src/app';

let awsServerlessExpress = require('aws-serverless-express');

let server = awsServerlessExpress.createServer(app);

export default (event, context) => {
	return awsServerlessExpress.proxy(server, event, context);
};
