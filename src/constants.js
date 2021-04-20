module.exports = Object.freeze({
	// All distance is measured in meters
	MAX_ROUTE_DISTANCE: 5000,
	MIN_INCREMENT_DISTANCE: 25,
	MAX_INCREMENT_DISTANCE: 200,
	MAXIMUM_WAYPOINTS_PER_ROUTE: 2,
	DEFAULT_ORIGIN_ADDRESS: '37 Market St New York, NY 10002',
	DEFAULT_DESTINATION_ADDRESS: '220 Henry Street, New York, NY, USA',
	DEFAULT_INCREMENT_DISTANCE: 100,
	NUM_EXAMPLE_COORDINATE_PAIRS: 3, // Displayed on frontend
	DEFAULT_DETOUR_DISTANCE: 100,
	MARKER_PLACEMENT_SPEED: 150, // Milliseconds
	DEFAULT_ERROR_MESSAGE: {
		error: 'Unable to create complete request!',
		message: 'Please contact James for assistance.',
	},
});
