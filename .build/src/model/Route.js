"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var calculations = require("../util/Calculations");
var Point_1 = require("../model/Point");
var Status_1 = require("./Status");
var axios_1 = require("axios");
var Constants_1 = require("../config/Constants");
var polyline_1 = require("polyline");
var vision_1 = require("@google-cloud/vision");
var Route = /** @class */ (function () {
    function Route(origin, destination, increment, waypoints) {
        if (waypoints === void 0) { waypoints = ''; }
        this.origin = origin;
        this.destination = destination;
        this.increment = increment;
        this.waypoints = waypoints;
        this.status = Status_1.Status.NOT_INITALIZED;
        this.points = [];
    }
    /**
     * Create the route and inject it into the 'route' member variable
     */
    Route.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, points, route;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetchGoogleDirections(this.origin, this.destination, this.waypoints)];
                    case 1:
                        data = _b.sent();
                        if (data.status != 'OK') {
                            if (data.status == 'NOT_FOUND')
                                this.status = Status_1.Status.ROUTE_NOT_FOUND;
                            else
                                this.status = Status_1.Status.INTERNAL_ERROR;
                            return [2 /*return*/, this];
                        }
                        _a = this;
                        return [4 /*yield*/, getDistanceFromLegs(data.routes[0]['legs'])];
                    case 2:
                        _a.distance = _b.sent();
                        if (this.distance > Constants_1.default.MAX_ROUTE_DISTANCE) {
                            this.status = Status_1.Status.EXCEEDED_MAXIMUM_DISTANCE;
                            return [2 /*return*/, this];
                        }
                        points = getPointsFromPolyline(data.routes[0].overview_polyline, this.increment);
                        if (points.length <= 0) {
                            this.status = Status_1.Status.INTERNAL_ERROR;
                            return [2 /*return*/, this];
                        }
                        return [4 /*yield*/, snapPointsToRoad(points)];
                    case 3:
                        route = _b.sent();
                        if (route.length <= 0)
                            this.status = Status_1.Status.INTERNAL_ERROR;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Add query parameters to route data
     */
    Route.prototype.addParameters = function (panoramaId, panoramaText) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!panoramaId && !panoramaText)
                            return [2 /*return*/, this];
                        promises = [], client = new vision_1.default.ImageAnnotatorClient();
                        console.log(this.points);
                        // for (let i = 0; i < this.points.length; i++) {
                        // 	(function (i) {
                        // 		let p = this.points[i]['location'],
                        // 			point = new Point(p['latitude'], p['longitude']);
                        // 		if (panoramaId) {
                        // 			promises.push(
                        // 				getPanoramaId(point).then((pano_id: string) => {
                        // 					point.setPanoramaId(pano_id);
                        // 				})
                        // 			);
                        // 		}
                        // 		if (panoramaText) {
                        // 			this.points[i]['pano_text'] = '';
                        // 			for (let heading = 0; heading < 360; heading += 120) {
                        // 				promises.push(
                        // 					getPanoramaText(point, client, heading).then((pano_text) => {
                        // 						this.point[i]['pano_text'] += pano_text + ',';
                        // 					})
                        // 				);
                        // 			}
                        // 		}
                        // 	})(i);
                        // }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        // for (let i = 0; i < this.points.length; i++) {
                        // 	(function (i) {
                        // 		let p = this.points[i]['location'],
                        // 			point = new Point(p['latitude'], p['longitude']);
                        // 		if (panoramaId) {
                        // 			promises.push(
                        // 				getPanoramaId(point).then((pano_id: string) => {
                        // 					point.setPanoramaId(pano_id);
                        // 				})
                        // 			);
                        // 		}
                        // 		if (panoramaText) {
                        // 			this.points[i]['pano_text'] = '';
                        // 			for (let heading = 0; heading < 360; heading += 120) {
                        // 				promises.push(
                        // 					getPanoramaText(point, client, heading).then((pano_text) => {
                        // 						this.point[i]['pano_text'] += pano_text + ',';
                        // 					})
                        // 				);
                        // 			}
                        // 		}
                        // 	})(i);
                        // }
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return Route;
}());
exports.default = Route;
var fetchGoogleDirections = function (origin, destination, waypoints) { return __awaiter(void 0, void 0, void 0, function () {
    var key, url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = process.env.GOOGLE_MAPS_BACKEND_KEY, url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&key=" + key + "&waypoints=" + waypoints;
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var getDistanceFromLegs = function (legs) { return __awaiter(void 0, void 0, void 0, function () {
    var distance, _i, legs_1, leg;
    return __generator(this, function (_a) {
        distance = 0;
        for (_i = 0, legs_1 = legs; _i < legs_1.length; _i++) {
            leg = legs_1[_i];
            distance += leg['distance']['value'];
        }
        return [2 /*return*/, distance];
    });
}); };
var getPointsFromPolyline = function (polyline, increment) {
    var points = polyline_1.decode(polyline.points), validPoints = [], currentPoint = points[0], // Temporary marker
    distanceUntilNextPoint = 0, // Starts at 0 because 1st point should be added immediately
    i = 0;
    while (i < points.length) {
        currentPoint = new Point_1.default(points[i][0], points[i][1]);
        var nextPoint = new Point_1.default(points[i + 1][0], points[i + 1][0]);
        var distanceBetweenPoints = calculations.getDistanceBetweenPoints(currentPoint, nextPoint);
        if (distanceBetweenPoints < distanceUntilNextPoint) {
            distanceUntilNextPoint -= distanceBetweenPoints;
            currentPoint = points[i + 1];
            i++;
        }
        else {
            // Incrementally create new point from current point
            var newPoint = calculations.getIntermediatePoint(currentPoint, nextPoint, distanceUntilNextPoint);
            validPoints.push(newPoint);
            currentPoint = newPoint; // Set current position to newly added point
            distanceUntilNextPoint = increment; // Point added, reset distance
        }
    }
    return validPoints;
};
var snapPointsToRoad = function (points) { return __awaiter(void 0, void 0, void 0, function () {
    var pointsRemaining, route, apiCalls, path, minRouteIndex, maxRouteIndex, i, currentPoint, key, url, response, snappedPoints, i, p;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pointsRemaining = points.length, route = [], apiCalls = 0, path = '';
                _a.label = 1;
            case 1:
                if (!(pointsRemaining > 0)) return [3 /*break*/, 3];
                minRouteIndex = apiCalls * 100, maxRouteIndex = minRouteIndex + 100;
                for (i = minRouteIndex; i < maxRouteIndex; i++) {
                    currentPoint = points[i];
                    if (currentPoint == undefined)
                        break; // End loop if there is no current point
                    path += currentPoint[0] + ',' + currentPoint[1] + '|'; // Add current point coordinates to path string
                }
                path = path.slice(0, -1);
                key = process.env.GOOGLE_MAPS_BACKEND_KEY, url = "https://roads.googleapis.com/v1/snapToRoads?path=" + path + "&key=" + key;
                return [4 /*yield*/, axios_1.default.get(url)];
            case 2:
                response = _a.sent(), snappedPoints = response.data.snappedPoints;
                if (snappedPoints == undefined)
                    return [2 /*return*/, []];
                // Loop through all snapped points and add them to corrected route array
                for (i = 0; i < snappedPoints.length; i++) {
                    p = snappedPoints[i]['location'];
                    route.push(new Point_1.default(p['latitude'], p['longitude']));
                }
                pointsRemaining -= 100;
                apiCalls++;
                path = '';
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, route];
        }
    });
}); };
//# sourceMappingURL=Route.js.map