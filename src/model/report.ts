import {Point} from '.'
import {Route} from '.'
import {containsPanoramaText} from './option'

export class Report {
  status: ReportStatus
  convergencePoint?: Point
  divergencePoint?: Point
  matchingText: {
    text: string
    routePoint: Point
    detourPoint: Point
  }[]
  route: Route
  detour: Route

  constructor(route: Route, detour: Route) {
    this.route = route
    this.detour = detour

    if (
      !containsPanoramaText(route.options) ||
      !containsPanoramaText(detour.options)
    ) {
      this.status = ReportStatus.NO_TEXT_DATA
      return
    }

    const shorterLength: number = Math.min(
      route.points.length,
      detour.points.length
    )

    this.matchingText = []

    for (let i: number = 0; i < shorterLength; i++) {
      route.points[i].panoramaText!.forEach((routeText) => {
        if (detour.points[i].panoramaText?.includes(routeText)) {
          this.matchingText.push({
            text: routeText,
            routePoint: route.points[i],
            detourPoint: detour.points[i]
          })
        } else if (detour.points[i].panoramaText) {
          this.convergencePoint = route.points[i]
        }
      })
    }

    route.points = route.points.reverse()
    detour.points = detour.points.reverse()

    for (let i: number = 0; i < shorterLength; i++) {
      route.points[i].panoramaText!.forEach((routeText) => {
        if (detour.points[i].panoramaText?.includes(routeText)) {
          this.matchingText.push({
            text: routeText,
            routePoint: route.points[i],
            detourPoint: detour.points[i]
          })
        } else if (detour.points[i].panoramaText) {
          this.divergencePoint = route.points[i]
        }
      })
    }

    if (this.convergencePoint && this.divergencePoint) {
      this.status = ReportStatus.DIFFERENT_ROUTES
    } else {
      this.status = ReportStatus.SAME_ROUTES
    }
  }
}

export enum ReportStatus {
  NO_TEXT_DATA = 'No text was detected within the route and detour data.',
  DIFFERENT_ROUTES = 'The route and detor seem to diverge from one another based on the text data.',
  SAME_ROUTES = 'There route and detour do not seem to diverge from one another based on their text data.'
}
