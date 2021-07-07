import { Point } from '..';
import { Route } from '..';

export class Report {
	status: ReportStatus;
	convergencePoint: Point;
	divergencePoint: Point;
	matchingText: [string[], Point];
	route: Route;
	detour: Route;

	constructor(route: Route, detour: Route) {
		if (!route.containsPanoramaText() || !detour.containsPanoramaText()) {
			this.status = ReportStatus.NO_TEXT_DATA;
			return;
		}

		// TODO: Generate report on route and detour data.
	}
}

export enum ReportStatus {
	NO_TEXT_DATA = 'No text was detected within the route and detour data.',
	DIFFERENT_ROUTES = 'The route and detor have differences in their locations based on the text data.',
}
