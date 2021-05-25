import Route from '../../../src/model/Route';
import { Status } from '../../../src/model/Status';

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
