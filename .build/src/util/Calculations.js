"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBearingFromPoints = exports.getPointFromDistance = exports.getIntermediatePoint = exports.getDistanceBetweenPoints = void 0;
var Point_1 = require("../model/Point");
/**
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */
var getDistanceBetweenPoints = function (pointA, pointB) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 -
        c((pointB.getLatitude() - pointA.getLatitude()) * p) / 2 +
        (c(pointA.getLatitude() * p) *
            c(pointB.getLatitude() * p) *
            (1 - c((pointB.getLongitude() - pointA.getLongitude()) * p))) /
            2;
    return 12742000 * Math.asin(Math.sqrt(a));
};
exports.getDistanceBetweenPoints = getDistanceBetweenPoints;
/**
 * @author James Worden
 * @returns point between two points that is a certain distance away from the first
 */
var getIntermediatePoint = function (pointA, pointB, distance) {
    var bearing = getBearingFromPoints(pointA, pointB);
    return getPointFromDistance(pointA, distance, bearing);
};
exports.getIntermediatePoint = getIntermediatePoint;
/**
 * https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
 * @returns initial bearing in degrees from North in degrees
 */
var getBearingFromPoints = function (pointA, pointB) {
    var startLat = toRadians(pointA.getLatitude());
    var startLng = toRadians(pointA.getLongitude());
    var destLat = toRadians(pointB.getLatitude());
    var destLng = toRadians(pointB.getLongitude());
    var y = Math.sin(destLng - startLng) * Math.cos(destLat);
    var x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    var bearing = toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360;
};
exports.getBearingFromPoints = getBearingFromPoints;
/**
 * https://stackoverflow.com/a/46410871/13549
 * @returns point that is a given distance and angle from a given point
 */
var getPointFromDistance = function (point, distance, bearing) {
    distance /= 1000; // Convert distance from M to KM
    bearing = (bearing * Math.PI) / 180; // Convert bearing to radian
    var radius = 6378.1, // Radius of the Earth
    radianLatitude = (point.getLatitude() * Math.PI) / 180, // Current coords to radians
    radianLongitude = (point.getLongitude() * Math.PI) / 180;
    radianLatitude = Math.asin(Math.sin(radianLatitude) * Math.cos(distance / radius) +
        Math.cos(radianLatitude) * Math.sin(distance / radius) * Math.cos(bearing));
    radianLongitude += Math.atan2(Math.sin(bearing) * Math.sin(distance / radius) * Math.cos(radianLongitude), Math.cos(distance / radius) - Math.sin(radianLongitude) * Math.sin(radianLongitude));
    // Coords back to degrees and return
    var latitude = (radianLatitude * 180) / Math.PI;
    var longitude = (radianLongitude * 180) / Math.PI;
    return new Point_1.default(latitude, longitude);
};
exports.getPointFromDistance = getPointFromDistance;
/* Converts from degrees to radians. */
var toRadians = function (degrees) { return (degrees * Math.PI) / 180; };
/* Converts from radians to degrees. */
var toDegrees = function (radians) { return (radians * 180) / Math.PI; };
//# sourceMappingURL=Calculations.js.map