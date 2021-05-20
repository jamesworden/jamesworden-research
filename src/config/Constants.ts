export default Object.freeze({
	// All distance is measured in meters
	MAX_ROUTE_DISTANCE: 2000,
	MIN_INCREMENT_DISTANCE: 1,
	MAX_INCREMENT_DISTANCE: 250,
	MAXIMUM_WAYPOINTS_PER_ROUTE: 5,
	DEFAULT_INCREMENT_DISTANCE: 100,
	NUM_EXAMPLE_COORDINATE_PAIRS: 3, // Displayed on frontend
	MARKER_PLACEMENT_SPEED: 150, // Milliseconds
	DEFAULT_ERROR_MESSAGE: {
		error: 'Unable to create complete request!',
		message: 'Please contact James for assistance.',
	},
});
