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

    this.route = route
    this.detour = detour

    if (
      !this.route.options.includes(Option.PANORAMA_TEXT) ||
      !this.detour.options.includes(Option.PANORAMA_TEXT)
    ) {
      this.status = Status.NO_TEXT_DATA
      return
    }

    // Fowards through route
    for (const index in this.route.points) {
      const d = this.detour.points[index].panoramaText,
        r = this.route.points[index].panoramaText,
        a = r.filter(element => d.includes(element))

      if (a.length > 0) {
        this.matchingText.push(a, this.route.points[index])
        this.divergencePoint = this.route.points[index]
      } else {
        this.status = Status.DIFFERENT_ROUTES
        break
      }
    }
    // Backwards through route
    const difference = this.detour.points.length - this.route.points.length
    for (let index = this.route.points.length - 1; index >= 0; index--) {
      const d = this.detour.points[difference + index].panoramaText,
        r = this.route.points[index].panoramaText,
        a = r.filter(element => d.includes(element))

      if (a.length > 0) {
        this.matchingText.push(a, this.route.points[index])
        this.convergencePoint = this.route.points[index]
      } else if (a.length == 0 && r.length == 0) {
        // No mathing text at either point, can't compare
      } else {
        this.status = Status.DIFFERENT_ROUTES
        break
      }
    }
  }
}

export enum Status {
  NO_TEXT_DATA = 'No text was detected within the route and detor data.',
  DIFFERENT_ROUTES = 'The route and detor have differences in their locations based on the text data.'
}
