const constants = require('../constants');

/**
 * @return Detour route using a given route and its increment distance.
 * This splits the route into two halves; the first half remains the same,
 * but the second half is re-calculated with an off-centered waypoint in the middle.
 * This waypoint simulates a detour 3/4 the way through the route.
 */
const getDetour = async function (route, increment) {
	route = route.route; // Use route array
	// Define waypoint above the point 3/4 through the route
	length = route.length;
	half = Math.ceil(length / 2);
	firstHalf = route.slice(0, half);
	midpoint = route[half]['location']; // Beginning of detour
	destination = route[length - 1]['location']; // End of detour and route
	calculations = require('../route/calculations');
	distance = calculations.getDistanceBetweenPoints(
		midpoint['latitude'],
		midpoint['longitude'],
		destination['latitude'],
		destination['longitude']
	);
	intermediate = calculations.getIntermediatePoint(
		midpoint['latitude'],
		midpoint['longitude'],
		destination['latitude'],
		destination['longitude'],
		distance / 2
	);
	bearing = calculations.getBearingFromPoints(
		// Bearing the the direction the route is going in
		midpoint['latitude'],
		midpoint['longitude'],
		destination['latitude'],
		destination['longitude']
	);
	detourPoint = calculations.getPointFromDistance(
		intermediate[0],
		intermediate[1],
		constants.DEFAULT_DETOUR_DISTANCE,
		bearing - 90 // Subtract 90 to make detour waypoint perpendicular to route
	);
	detourString = `${detourPoint[0]},${detourPoint[1]}`;
	midpointString = `${midpoint['latitude']},${midpoint['longitude']}`;
	destinationString = `${destination['latitude']},${destination['longitude']}`;
	const { getRoute } = require('../route/route');
	secondHalf = getRoute(
		midpointString,
		destinationString,
		increment,
		false,
		false,
		true,
		detourString
	);
	secondHalf[0]['detour'] = 'true';
	return { route: firstHalf.concat(secondHalf) };
};
module.exports = { getDetour };
