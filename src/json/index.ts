import {Point, Region, Report, Route} from '../model'

import sampleDetourJSON from './sample-detour.json'
import samplePointJSON from './sample-point.json'
import sampleRegionJSON from './sample-region.json'
import sampleRegionRouteJSON from './sample-region-route.json'
import sampleReportJSON from './sample-report.json'
import sampleRouteJSON from './sample-route.json'

export const sampleRegionRoute = sampleRegionRouteJSON as Route
export const sampleRegion = sampleRegionJSON as Region
export const sampleRoute = sampleRouteJSON as Route
export const sampleDetour = sampleDetourJSON as Route
export const samplePoint = samplePointJSON as Point
export const sampleReport = sampleReportJSON as Report
