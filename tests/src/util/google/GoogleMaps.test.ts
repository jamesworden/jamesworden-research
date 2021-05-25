import * as GoogleMaps from '../../../../src/util/google/GoogleMaps';

test('Get google directions', async () => {
	/* Testing address inputs */
	let invalidData = await GoogleMaps.getDirections(
		'ddsadcsadsadasas',
		'dsadsadasdsadsaa',
		'datadsadsa'
	);
	expect(invalidData.status).toBe('NOT_FOUND');
	let coodrinateData = await GoogleMaps.getDirections(
		'40.758091, -73.996619',
		'40.759290, -73.995755',
		''
	);
	expect(coodrinateData.status).toBe('OK');
	expect(coodrinateData.geocoded_waypoints).toBeDefined();
	expect(coodrinateData.routes).toHaveLength(1);
	let addressData = await GoogleMaps.getDirections(
		'366 W 46th St, New York, NY 10036',
		'807 8th Ave, New York, NY 10019',
		'701 9th Ave, New York, NY 10019'
	);
	expect(addressData.status).toBe('OK');
	expect(addressData.geocoded_waypoints).toHaveLength(3);
	expect(addressData.routes).toHaveLength(1);
	/* Necessary attributes */
	expect(typeof addressData.routes[0]['legs'][0]['distance']['text']).toBe('string');
	expect(typeof addressData.routes[0]['legs'][0]['distance']['value']).toBe('number');
	expect(typeof addressData.routes[0]['overview_polyline']['points']).toBe('string');
});
