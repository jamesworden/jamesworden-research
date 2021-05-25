let data = require('../../../src/json/googleDirectionsData.json');

import * as Calculations from '../../../src/util/Calculations';

import Point from '../../../src/model/Point';
import { decode } from 'polyline';

test('Get distance from legs', () => {
	let legs = data['routes'][0]['legs'],
		distance = Calculations.getDistanceFromLegs(legs);
	expect(distance).toEqual(152);
});

test('Get points from polyline', () => {
	let encodedPolyline: string = data['routes'][0]['overview_polyline']['points'],
		decodedPoints: any[] = decode(encodedPolyline);
	expect(typeof decodedPoints[0][0]).toBe('number');
	expect(typeof decodedPoints[0][1]).toBe('number');
	let points: Point[] = Calculations.getPointsFromEncodedPolyline(encodedPolyline, 5);
	expect(decodedPoints.length < points.length);
	points.forEach((p) => {
		expect(p.getLatitude()).toBeLessThanOrEqual(90);
		expect(p.getLatitude()).toBeGreaterThanOrEqual(-90);
		expect(p.getLongitude()).toBeLessThanOrEqual(180);
		expect(p.getLongitude()).toBeGreaterThanOrEqual(-180);
	});
});
