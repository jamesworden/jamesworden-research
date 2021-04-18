const constants = require('../constants');

/**
 * Contains statistical information with OCR data
 * @param {String} origin Origin address
 * @param {String} destination Destination Address
 * @param {String} waypoints Waypoints for detour in route to simulate spoofed locations
 * @param {Integer} increment Increment distance between GPS coordinates
 * @returns A report of how likely two routes separated from one another
 */
const getReport = async function (origin, destination, waypoints, increment) {
	// Production
	// Get both routes and panorama text along the way
	// const { getRoute } = require('../route/route');
	// let detour, regular, error;
	// await Promise.all([
	// 	getRoute(origin, destination, increment, false, true, true)
	// 		.then((r) => (regular = r))
	// 		.catch(() => (error = true)),
	// 	getRoute(origin, destination, increment, false, true, true, waypoints)
	// 		.then((r) => (detour = r))
	// 		.catch(() => (error = true)),
	// ]);
	//
	// if (error) return { error: constants.DEFAULT_ERROR_MESSAGE };

	// Development
	let detour = require('../sampledata/detour_text_route.json'),
		regular = require('../sampledata/regular_text_route.json');

	//Loop through the regular route and halt when the detour route diverges

	// spoofed: true,
	// confidence_value: 39%
	// origin: { latitude: 30, longitude -40 },
	// destination: { latitude: 30, longitude -40 },
	// diverge_at: { latitude: 30, longitude -40 },
	// converge_at: { latitude: 30, longitude -40 },
	// matches_before_diverging: 32 / 50 matching strings
	// matches_during_diverging: 4 / 39 matching strings
	// matches_after_diverging: 26 / 29 matching strings

	return { report: { detour, regular } };
};
module.exports = { getReport };
