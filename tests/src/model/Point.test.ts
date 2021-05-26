import Point from '../../../src/model/Point';

describe('Point declaration', () => {
	let latitude: number = 34.0002,
		longitude: number = 34.0001,
		point: Point = new Point(latitude, longitude);

	test('Point object contains appropriate values', () => {
		expect(point).toEqual({
			latitude: 34.0002,
			longitude: 34.0001,
		});
	});

	test('Point getters and setters', () => {
		expect(point.getPanoramaId()).toBeUndefined();
		point.setPanoramaId('test');
		expect(point.getPanoramaId()).toEqual('test');
		point.addPanoramaText(['test']);
		expect(point.getPanoramaText()).toEqual(['test']);
		point.addPanoramaText(['test', 'another', 'another1']);
		expect(point.getPanoramaText()).toEqual(['test', 'test', 'another', 'another1']);
	});
});
