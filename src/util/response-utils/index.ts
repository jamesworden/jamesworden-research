import {HttpStatusCode} from './http-status-code'

export type Failure = {
  statusCode: HttpStatusCode
  response: {
    error: string
    message?: string
  }
}

export function isFailure(object: any): object is Failure {
  const containsStatusCode: boolean = 'statusCode' in object
  const containsResponse: boolean = 'response' in object

  return containsStatusCode && containsResponse
}
