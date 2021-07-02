import { PointFactory, RouteFactory } from './model';
import { boundsRoutes, imageRoutes, reportRoutes, routeRoutes, viewRoutes } from './controller';
import express, { Express } from 'express';
import { googleCloudVision, googleMaps, googleStreetView, tesseract } from './provider';

import { __prod__ } from './config';
import path from 'path';

class App {
	routeFactory: RouteFactory;
	pointFactory: PointFactory;
	server: Express;
	port: number;

	constructor() {
		const server: Express = express();

		server.set('views', path.join(__dirname, '/frontend/views'));
		server.set('view engine', 'js');

		server.engine('js', require('express-react-views').createEngine());

		server.use('/api/image', imageRoutes);
		server.use('/api/report', reportRoutes);
		server.use('/api/route', routeRoutes);
		server.use('/api/bounds', boundsRoutes);
		server.use('/', viewRoutes);

		this.routeFactory = new RouteFactory(googleMaps);
		this.pointFactory = new PointFactory(googleStreetView, googleCloudVision);
		this.server = server;
		this.port = 3000;
	}

	run(port?: number) {
		let env: string = __prod__ ? 'production' : 'development';

		this.server.listen(port, () => {
			console.log(`Application running in ${env} on port ${port || this.port}`);
		});
	}
}

const app = new App();

export { app };
