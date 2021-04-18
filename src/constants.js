module.exports = Object.freeze({
	// All distance is measured in meters
	MAX_DISTANCE_BETWEEN_ADDRESSES: 5000,
	MIN_INCREMENT_DISTANCE: 1,
	MAX_INCREMENT_DISTANCE: 100,
	MAXIMUM_WAYPOINTS_PER_ROUTE: 2,
	DEFAULT_ERROR_MESSAGE: {
		error: 'Unable to create complete request!',
		message: 'Please contact James for assistance.',
	},
	DEFAULT_ORIGIN_ADDRESS: 'New York, NY 10119',
	DEFAULT_DESTINATION_ADDRESS: '56 E 34th St, New York, NY 10016',
	DEFAULT_INCREMENT_DISTANCE: 100,
	NUM_EXAMPLE_COORDINATE_PAIRS: 5, // Displayed on frontend
});
