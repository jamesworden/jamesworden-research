import {Option, Route, Status as RouteStatus} from './Route'

import {Point} from './Point'

export class Report {
  status: RouteStatus | Status // If any of the routes have an error, the report status will assume that error.
  convergencePoint: Point
  divergencePoint: Point
  matchingText: [string[], Point]
  route: Route
  detour: Route

  constructor(route: Route, detour: Route) {
    if (route.status != RouteStatus.OK) {
      this.status = route.status
    } else if (detour.status != RouteStatus.OK) {
      this.status = detour.status
    } else {
      this.status = RouteStatus.NOT_INITALIZED
    }

    if (
      !this.route.options.includes(Option.PANORAMA_TEXT) ||
      !this.detour.options.includes(Option.PANORAMA_TEXT)
    ) {
      this.status = Status.NO_TEXT_DATA
      return
    }

    // Todo: Generate report on route and detour data.
  }
}

export enum Status {
  NO_TEXT_DATA = 'No text was detected within the route and detour data.',
  DIFFERENT_ROUTES = 'The route and detor have differences in their locations based on the text data.'
}
