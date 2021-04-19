/**
 * Contains statistical information with OCR data
 * @param {Object} route
 * @param {Object} detour
 * @returns A report of how likely two routes separated from one another
 */
const getReport = async function (route, detour) {
	route = route.route;
	detour = detour.route;
	// Loop through the regular route and halt when no string of text are shared
	// The last point to have matching text is the Divergence point

	// Loop backwards and halt when no strings of text are shared
	// The last point to have matching text is the Convergence point

	// Message: 'All waypoints had text in common with one another.'

	return {
		report: 'Test',
		Object: 'This is a javascript object',
		number: 4,
	};
};

module.exports = { getReport };

// --- Example Brainstorming Statistical Information ---- //
// spoofed: true,
// confidence_value: 39%
// origin: { latitude: 30, longitude -40 },
// destination: { latitude: 30, longitude -40 },
// diverge_at: { latitude: 30, longitude -40 },
// converge_at: { latitude: 30, longitude -40 },
// matches_before_diverging: 32 / 50 matching strings
// matches_during_diverging: 4 / 39 matching strings
// matches_after_diverging: 26 / 29 matching strings
// --- Example Brainstorming Statistical Information ---- //
