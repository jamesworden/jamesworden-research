"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status_1 = require("./Status");
var Report = /** @class */ (function () {
    function Report(route, detour) {
        if (route.status != Status_1.Status.OK)
            this.status = route.status;
        else if (detour.status != Status_1.Status.OK)
            this.status = route.status;
        else
            this.status = Status_1.Status.NOT_INITALIZED;
        this.route = route;
        this.detour = detour;
        if (!(this.detour['route'][0]['panoramaText'] && this.route['route'][0]['panoramaText'])) {
            this.status = Status_1.Status.NO_TEXT_DATA;
            return;
        }
        var _loop_1 = function (index) {
            var d = this_1.detour['points'][index]['panoramaText'].split(',').filter(function (item) { return item; }), r = this_1.route['points'][index]['panoramaText'].split(',').filter(function (item) { return item; }), a = r.filter(function (element) { return d.includes(element); });
            if (a.length > 0) {
                this_1.matchingText.push(a, this_1.route['points'][index]);
                this_1.divergencePoint = this_1.route['points']['index'];
            }
            else {
                this_1.status = Status_1.Status.DIFFERENT_ROUTES;
                return "break";
            }
        };
        var this_1 = this;
        // Fowards through route
        for (var index in this.route.points) {
            var state_1 = _loop_1(index);
            if (state_1 === "break")
                break;
        }
        // Backwards through route
        var difference = this.detour['points'].length - this.route['points'].length;
        var _loop_2 = function (index) {
            var d = this_2.detour['points'][difference + index]['panoramaText']
                .split(',')
                .filter(function (item) { return item; }), r = this_2.route['points'][index]['panoramaText'].split(',').filter(function (item) { return item; }), a = r.filter(function (element) { return d.includes(element); });
            if (a.length > 0) {
                this_2.matchingText.push(a, this_2.route['points'][index]);
                this_2.convergencePoint = this_2.route['points'][index];
            }
            else if (a.length == 0 && r.length == 0) {
            }
            else {
                this_2.status = Status_1.Status.DIFFERENT_ROUTES;
                return "break";
            }
        };
        var this_2 = this;
        for (var index = this.route['length'] - 1; index >= 0; index--) {
            var state_2 = _loop_2(index);
            if (state_2 === "break")
                break;
        }
    }
    return Report;
}());
exports.default = Report;
//# sourceMappingURL=Report.js.map