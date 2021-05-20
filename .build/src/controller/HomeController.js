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
var Report_1 = require("../model/Report");
var Route_1 = require("../model/Route");
var Constants_1 = require("../config/Constants");
var express = require('express');
var routes = express.Router({ mergeParams: true });
routes.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var route, report, error, origin, destination, increment, detour, waypoints, key, queriesExist;
        return __generator(this, function (_a) {
            key = req.query.key;
            // If API key is correct, create new route; Else, use sample data
            if (key && key == process.env.RESEARCH_API_KEY) {
                origin = req.query.origin;
                destination = req.query.destination;
                increment = req.query.increment;
                waypoints = req.query.waypoints;
                route = new Route_1.default(origin, destination, increment).initialize();
                detour = new Route_1.default(origin, destination, increment, waypoints).initialize();
            }
            else {
                queriesExist = req.query.origin || req.query.destination || req.query.increment;
                if (!key && queriesExist)
                    error = 'An API key is required for a custom route.';
                else if (key && queriesExist)
                    error = 'Invalid API key! Contact James for assistance.';
                route = require('../sampledata/route.json');
                detour = require('../sampledata/detour.json');
                origin = route.origin;
                destination = route.destination;
                increment = route.increment;
            }
            report = new Report_1.default(route, detour);
            res.render('index.html', {
                GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_FRONTEND_KEY,
                numExampleCoordinatePairs: Constants_1.default.NUM_EXAMPLE_COORDINATE_PAIRS,
                markerPlacementSpeed: Constants_1.default.MARKER_PLACEMENT_SPEED,
                maxIncrement: Constants_1.default.MAX_INCREMENT_DISTANCE,
                minIncrement: Constants_1.default.MIN_INCREMENT_DISTANCE,
                report: JSON.stringify(report),
                route: JSON.stringify(route),
                detour: JSON.stringify(detour),
                waypoints: detour.waypoints,
                origin: origin,
                destination: destination,
                increment: increment,
                error: error,
                key: key,
            });
            return [2 /*return*/];
        });
    });
});
exports.default = routes;
//# sourceMappingURL=HomeController.js.map