import Point from './Point';
import Route from './Route';
import { Status } from './Status';

export default class Report {
	status: Status;
	convergencePoint: Point;
	divergencePoint: Point;
	matchingText: [string[], Point];
	route: Route;
	detour: Route;

	constructor(route: Route, detour: Route) {
		if (route.status != Status.OK) this.status = route.status;
		else if (detour.status != Status.OK) this.status = route.status;
		else this.status = Status.NOT_INITALIZED;
		this.route = route;
		this.detour = detour;

		if (!(this.detour['route'][0]['panoramaText'] && this.route['route'][0]['panoramaText'])) {
			this.status = Status.NO_TEXT_DATA;
			return;
		}
		// Fowards through route
		for (let index in this.route.points) {
			let d = this.detour['points'][index]['panoramaText'].split(',').filter((item) => item),
				r = this.route['points'][index]['panoramaText'].split(',').filter((item) => item),
				a = r.filter((element) => d.includes(element));
			if (a.length > 0) {
				this.matchingText.push(a, this.route['points'][index]);
				this.divergencePoint = this.route['points']['index'];
			} else {
				this.status = Status.DIFFERENT_ROUTES;
				break;
			}
		}
		// Backwards through route
		let difference = this.detour['points'].length - this.route['points'].length;
		for (let index = this.route['length'] - 1; index >= 0; index--) {
			let d = this.detour['points'][difference + index]['panoramaText']
					.split(',')
					.filter((item) => item),
				r = this.route['points'][index]['panoramaText'].split(',').filter((item) => item),
				a = r.filter((element) => d.includes(element));
			if (a.length > 0) {
				this.matchingText.push(a, this.route['points'][index]);
				this.convergencePoint = this.route['points'][index];
			} else if (a.length == 0 && r.length == 0) {
			} else {
				this.status = Status.DIFFERENT_ROUTES;
				break;
			}
		}
	}
}
