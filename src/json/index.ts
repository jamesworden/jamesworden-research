import {Route} from '../model'
import sampleDetourJSON from './sample-detour.json'
import sampleDirectionsResponseDataJSON from './sample-directions-response-data.json'
import sampleRouteJSON from './sample-route.json'

export const sampleRoute = new Route(
  sampleRouteJSON.origin,
  sampleRouteJSON.destination,
  sampleRouteJSON.distance,
  sampleRouteJSON.increment,
  sampleRouteJSON.points
)

export const sampleDetour = new Route(
  sampleDetourJSON.origin,
  sampleDetourJSON.destination,
  sampleDetourJSON.distance,
  sampleDetourJSON.increment,
  sampleDetourJSON.points
)

/**
 * Doesn't correspond to the actual type, but it's a real response
 */
export const sampleDirectionsResponseData = sampleDirectionsResponseDataJSON
