"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    Point.prototype.getLatitude = function () {
        return this.latitude;
    };
    Point.prototype.getLongitude = function () {
        return this.longitude;
    };
    Point.prototype.setPanoramaId = function (panoramaId) {
        this.panoramaId = panoramaId;
    };
    Point.prototype.setPanoramaText = function (panoramaText) {
        this.panoramaText = panoramaText;
    };
    Point.prototype.toString = function () {
        return this.latitude + ',' + this.longitude;
    };
    return Point;
}());
exports.default = Point;
//# sourceMappingURL=Point.js.map