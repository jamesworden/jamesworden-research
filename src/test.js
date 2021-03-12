/////////////////////
/// POLYLINE TEST ///
/////////////////////

console.log('POLYLINE TEST');

let polylinePoints = [
	[40.72478, -73.79213],
	[40.72482, -73.79213],
	[40.72495, -73.79174],
	[40.7253, -73.79194],
	[40.72459, -73.794],
];

let randomPolylinePoints = [
	[401.72478, -73.79213],
	[40.72482, -73.79213],
	[40.72495, -73.79174],
	[-40232.7253, -73.79321321194],
	[40.72459, -73.794],
];

// Get the optimized and incremented route
const calculations = require('./route/calculations');
const route = calculations.createRoute(polylinePoints);
console.log(route); // Print Route points

///////////////////////////////
/// INCREMENTAL POINT TEST ////
///////////////////////////////

console.log('INCREMENTAL POINT TEST');

// Testing coordinates
lat1 = 40.7247675;
lng1 = -73.793485;
lat2 = 40.7247453125;
lng2 = -73.793549375;
distance = 10; // Meters

let bearing = calculations.getBearingFromPoints(lat1, lng1, lat2, lng2);
let point = calculations.getPointFromDistance(lat1, lng1, distance, bearing);
console.log(point); // Print Point
