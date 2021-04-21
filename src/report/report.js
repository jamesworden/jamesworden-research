/**
 * Contains statistical information with OCR data
 * @param {Object} route
 * @param {Object} detour
 * @returns A report of how likely two routes separated from one another
 */
const getReport = async function (route, detour) {
	// Ensure that inputs are defined correctly
	if (route.error || detour.error) return { error: { route: route.error, detour: detour.error } };
	if (!(detour['route'][0]['pano_text'] && route['route'][0]['pano_text']))
		return { error: 'There is no text data in the given route!' };

	let valid,
		convergence_point,
		divergence_point,
		detour_waypoints = detour['waypoints'],
		origin = route['origin'],
		destination = route['destination'],
		route_distance = route['distance'],
		detour_distance = detour['distance'],
		matching_text = [];

	route = route.route;
	detour = detour.route;

	// Fowards through route
	for (index in route) {
		d = detour[index].pano_text.split(',').filter((item) => item);
		r = route[index].pano_text.split(',').filter((item) => item);
		a = r.filter((element) => d.includes(element));
		if (a.length > 0) {
			// No Matching Text
			matching_text.push({
				text: a,
				location: route[index].location,
			});
			divergence_point = route[index].location;
		} else {
			valid = false;
			break;
		}
	}
	// Backwards through detour
	let backwards_array = [];
	difference = detour.length - route.length;
	for (index = route.length - 1; index >= 0; index--) {
		d = detour[difference + index].pano_text.split(',').filter((item) => item);
		r = route[index].pano_text.split(',').filter((item) => item);
		a = r.filter((element) => d.includes(element));
		if (a.length > 0) {
			// No Matching Text
			backwards_array.push({
				text: a,
				location: route[index].location,
			});
			convergence_point = route[index].location;
		} else {
			valid = false;
			break;
		}
	}
	// Reverse array to keep all the points sorted
	matching_text.concat(backwards_array.reverse());

	return {
		report: {
			valid,
			convergence_point,
			divergence_point,
			detour_waypoints,
			origin,
			destination,
			route_distance,
			detour_distance,
			matching_text,
			route,
			detour,
		},
	};
};

module.exports = { getReport };

// Loop through the regular route and halt when no string of text are shared
// The last point to have matching text is the Divergence point

// Loop backwards and halt when no strings of text are shared
// The last point to have matching text is the Convergence point

// Message: 'All waypoints had text in common with one another.'

// TODO - Really simple elaboration on the Route API explaining how it made the report
// Make everything more... in laymans terms?

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
