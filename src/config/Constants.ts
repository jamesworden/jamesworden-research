export const MAX_POINTS_PER_ROUTE = 250
export const MAX_WAYPOINTS_PER_ROUTE = 10
export const DEFAULT_INCREMENT_DISTANCE = 5
export const __prod__ = process.env.NODE_ENV === 'production'
export const PORT = process.env.SERVER_PORT || 3000
export const DEFAULT_ERROR_MESSAGE = {
  error: 'Unable to create complete request!',
  message: 'Please contact James for assistance.'
}
