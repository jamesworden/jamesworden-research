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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnappedPoints = exports.getDirections = void 0;
const Point_1 = __importDefault(require("../../model/Point"));
const axios_1 = __importDefault(require("axios"));
const key = process.env.GOOGLE_MAPS_BACKEND_KEY;
let getDirections = (origin, destination, waypoints) => __awaiter(void 0, void 0, void 0, function* () {
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&waypoints=${waypoints}`, response = yield axios_1.default.get(url);
    return response.data;
});
exports.getDirections = getDirections;
let getSnappedPoints = (points) => __awaiter(void 0, void 0, void 0, function* () {
    let pointsRemaining = points.length, route = [], apiCalls = 0, path = '';
    while (pointsRemaining > 0) {
        let minRouteIndex = apiCalls * 100, maxRouteIndex = minRouteIndex + 100;
        for (let i = minRouteIndex; i < maxRouteIndex; i++) {
            let currentPoint = points[i];
            if (currentPoint == undefined)
                break;
            path += currentPoint.getLatitude() + ',' + currentPoint.getLongitude() + '|';
        }
        path = path.slice(0, -1);
        let url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&key=${key}`, response = yield axios_1.default.get(url), snappedPoints = response.data.snappedPoints;
        if (snappedPoints == undefined)
            return [];
        for (let i = 0; i < snappedPoints.length; i++) {
            let p = snappedPoints[i]['location'];
            route.push(new Point_1.default(p['latitude'], p['longitude']));
        }
        pointsRemaining -= 100;
        apiCalls++;
        path = '';
    }
    return route;
});
exports.getSnappedPoints = getSnappedPoints;
//# sourceMappingURL=GoogleMaps.js.map