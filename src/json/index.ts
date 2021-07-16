import {Point, Report, Route} from '../model'

import sampleDetourJSON from './sample-detour.json'
import samplePointJSON from './sample-point.json'
import sampleReportJSON from './sample-report.json'
import sampleRouteJSON from './sample-route.json'

export const sampleRoute = sampleRouteJSON as Route
export const sampleDetour = sampleDetourJSON as Route
export const samplePoint = samplePointJSON as Point
export const sampleReport = sampleReportJSON as Report
