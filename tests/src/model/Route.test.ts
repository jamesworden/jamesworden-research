import Route, { fetchGoogleDirections } from '../../../src/model/Route';

import Constants from '../../../src/config/Constants';
import { Status } from '../../../src/model/Status';

let data = require('../../../src/json/googleDirectionsData.json');


describe('Route declaration', () => {
	let origin: string = '123 Main Street',
		destiantion: string = '567 Short Avenue',
		increment: number = 46,
		waypoints: string = 'Address 1|Address 2',
		route: Route = new Route(origin, destiantion, increment, waypoints);
	test('Route object contains appropriate values', () => {
		expect(route.origin).toBe(origin);
		expect(route.destination).toBe(destiantion);
		expect(route.increment).toBe(increment);
		expect(route.waypoints).toBe(waypoints);
		expect(route.status).toBe(Status.NOT_INITALIZED);
		expect(route.points).toEqual([]);
		expect(route.distance).toBe(undefined);
	});
});

describe('Route functions', () => {
	test('Fetch google directions', async () => {
		let invalidData = await fetchGoogleDirections(
			'ddsadcsadsadasas',
			'dsadsadasdsadsaa',
			'datadsadsa'
		);
		expect(invalidData.status).toBe('NOT_FOUND');
		let coodrinateData = await fetchGoogleDirections(
			'40.758091, -73.996619',
			'40.759290, -73.995755',
			''
		);
		expect(coodrinateData.status).toBe('OK');
		expect(coodrinateData.geocoded_waypoints).toBeDefined();
		expect(coodrinateData.routes).toHaveLength(1);
		let addressData = await fetchGoogleDirections(
			'366 W 46th St, New York, NY 10036',
			'807 8th Ave, New York, NY 10019',
			'701 9th Ave, New York, NY 10019'
		);
		expect(addressData.status).toBe('OK');
		expect(addressData.geocoded_waypoints).toHaveLength(3);
		expect(addressData.routes).toHaveLength(1);
	});
});
