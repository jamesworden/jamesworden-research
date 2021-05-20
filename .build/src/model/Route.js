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
    /* Create the route and inject it into the 'route' member variable */
    Route.prototype.initialize = function (panoramaText, panoramaId) {
        if (panoramaText === void 0) { panoramaText = false; }
        if (panoramaId === void 0) { panoramaId = false; }
        return __awaiter(this, void 0, void 0, function () {
            var key, url, response, data, status, legs, _i, legs_1, leg, points, validPoints, currentPoint, distanceUntilNextPoint, i, nextPoint, distanceBetweenPoints, newPoint, pointsRemaining, route, apiCalls, path, minRouteIndex, maxRouteIndex, currentPoint_1, url_1, response_1, snappedPoints, p, promises_1, _a, getPanoramaId_1, getPanoramaText_1, vision, client_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        key = process.env.GOOGLE_MAPS_BACKEND_KEY, url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + this.origin + "\n\t\t\t&destination=" + this.destination + "&key=" + key + "&waypoints=" + this.waypoints;
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _b.sent(), data = response.data, status = data.status;
                        if (status != 'OK') {
                            if (status == 'NOT_FOUND')
                                this.status = Status_1.Status.ROUTE_NOT_FOUND;
                            else
                                status = Status_1.Status.INTERNAL_ERROR;
                            return [2 /*return*/, this];
                        }
                        legs = data.routes[0]['legs'];
                        this.distance = 0;
                        for (_i = 0, legs_1 = legs; _i < legs_1.length; _i++) {
                            leg = legs_1[_i];
                            this.distance += leg['distance']['value'];
                        }
                        if (this.distance > Constants_1.default.MAX_ROUTE_DISTANCE) {
                            this.status = Status_1.Status.EXCEEDED_MAXIMUM_DISTANCE;
                            return [2 /*return*/, this];
                        }
                        points = polyline_1.decode(data.routes[0].overview_polyline.points), validPoints = [], currentPoint = points[0], distanceUntilNextPoint = 0, i = 0;
                        while (i < points.length) {
                            currentPoint = new Point_1.default(points[i][0], points[i][1]);
                            nextPoint = new Point_1.default(points[i + 1][0], points[i + 1][0]);
                            distanceBetweenPoints = calculations.getDistanceBetweenPoints(currentPoint, nextPoint);
                            if (distanceBetweenPoints < distanceUntilNextPoint) {
                                distanceUntilNextPoint -= distanceBetweenPoints;
                                currentPoint = points[i + 1];
                                i++;
                            }
                            else {
                                newPoint = calculations.getIntermediatePoint(currentPoint, nextPoint, distanceUntilNextPoint);
                                validPoints.push(newPoint);
                                currentPoint = newPoint; // Set current position to newly added point
                                distanceUntilNextPoint = this.increment; // Point added, reset distance
                            }
                        }
                        pointsRemaining = validPoints.length, route = [], apiCalls = 0, path = '';
                        _b.label = 2;
                    case 2:
                        if (!(pointsRemaining > 0)) return [3 /*break*/, 4];
                        minRouteIndex = apiCalls * 100, maxRouteIndex = minRouteIndex + 100;
                        for (i = minRouteIndex; i < maxRouteIndex; i++) {
                            currentPoint_1 = validPoints[i];
                            if (currentPoint_1 == undefined)
                                break; // End loop if there is no current point
                            path += currentPoint_1[0] + ',' + currentPoint_1[1] + '|'; // Add current point coordinates to path string
                        }
                        path = path.slice(0, -1);
                        url_1 = "https://roads.googleapis.com/v1/snapToRoads?path=" + path + "&key=" + key;
                        return [4 /*yield*/, axios_1.default.get(url_1)];
                    case 3:
                        response_1 = _b.sent(), snappedPoints = response_1.data.snappedPoints;
                        if (snappedPoints == undefined) {
                            this.status = Status_1.Status.INTERNAL_ERROR;
                            return [2 /*return*/, this];
                        }
                        // Loop through all snapped points and add them to corrected route array
                        for (i = 0; i < snappedPoints.length; i++) {
                            p = snappedPoints[i]['location'];
                            route.push(new Point_1.default(p['latitude'], p['longitude']));
                        }
                        pointsRemaining -= 100;
                        apiCalls++;
                        path = '';
                        return [3 /*break*/, 2];
                    case 4:
                        if (!(panoramaId || panoramaText)) return [3 /*break*/, 6];
                        promises_1 = [];
                        _a = require('./panorama'), getPanoramaId_1 = _a.getPanoramaId, getPanoramaText_1 = _a.getPanoramaText, vision = require('@google-cloud/vision'), client_1 = new vision.ImageAnnotatorClient();
                        // Loop through all coordinate pairs and push promises for each location
                        for (i = 0; i < route.length; i++) {
                            (function (i) {
                                var p = route[i]['location'], point = new Point_1.default(p['latitude'], p['longitude']);
                                if (panoramaId) {
                                    promises_1.push(getPanoramaId_1(point).then(function (pano_id) {
                                        point.setPanoramaId(pano_id);
                                    }));
                                }
                                if (panoramaText) {
                                    route[i]['pano_text'] = '';
                                    for (var heading = 0; heading < 360; heading += 120) {
                                        promises_1.push(getPanoramaText_1(point, client_1, heading).then(function (pano_text) {
                                            route[i]['pano_text'] += pano_text + ',';
                                        }));
                                    }
                                }
                            })(i);
                        }
                        return [4 /*yield*/, Promise.all(promises_1)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, this];
                }
            });
        });
    };
    return Route;
}());
exports.default = Route;
//# sourceMappingURL=Route.js.map