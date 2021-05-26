import app from './src/App';

let awsServerlessExpress = require('aws-serverless-express');

let server = awsServerlessExpress.createServer(app);

let handler = (event, context) => {
	return awsServerlessExpress.proxy(server, event, context);
};

export { handler };
