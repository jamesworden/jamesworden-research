import {HttpStatusCode} from './http-status-code'

export type Failure = {
  statusCode: HttpStatusCode
  response: {
    error: string
    message?: string
  }
}

export function isFailure(value: any): value is Failure {
  if (value instanceof Object) {
    const containsStatusCode: boolean = 'statusCode' in value
    const containsResponse: boolean = 'response' in value

    return containsStatusCode && containsResponse
  }

  return false
}
