/**
 * Contains statistical information with OCR data
 * @param {Array} route
 * @param {Array} detour
 * @returns A report of how likely two routes separated from one another
 */
const getReport = async function (route, detour) {
	// Ensure text exists
	if (!(detour[0].pano_text && route[0].pano_text))
		return { error: 'There is no text data in the given route!' };

	let valid,
		convergence_point,
		divergence_point,
		first_route = [],
		last_route = [];

	// Fowards through route
	for (index in route) {
		d = detour[index].pano_text.split(',').filter((item) => item);
		r = route[index].pano_text.split(',').filter((item) => item);
		a = r.filter((element) => d.includes(element));
		if (a.length > 0) {
			// No Matching Text
			first_route.push({
				matching_text: a,
				location: route[index].location,
			});
			divergence_point = route[index].location;
		} else {
			valid = false;
			break;
		}
	}
	// Backwards through detour
	difference = detour.length - route.length;
	for (index = route.length - 1; index >= 0; index--) {
		d = detour[difference + index].pano_text.split(',').filter((item) => item);
		r = route[index].pano_text.split(',').filter((item) => item);
		a = r.filter((element) => d.includes(element));
		if (a.length > 0) {
			// No Matching Text
			last_route.push({
				matching_text: a,
				location: route[index].location,
			});
			convergence_point = route[index].location;
		} else {
			valid = false;
			break;
		}
	}
	return {
		report: {
			valid,
			convergence_point,
			divergence_point,
			first_route,
			last_route,
		},
	};
};

module.exports = { getReport };

// Loop through the regular route and halt when no string of text are shared
// The last point to have matching text is the Divergence point

// Loop backwards and halt when no strings of text are shared
// The last point to have matching text is the Convergence point

// Message: 'All waypoints had text in common with one another.'

// TODO - Fix EJS errors one way or another It doesn't matter really
// TODO - Modular JS for frontend make code clean and organized
// TODO - Static JS and CSS FIles - also CSS is a mess, maybe keep it contained to the respective components?
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
