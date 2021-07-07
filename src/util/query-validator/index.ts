import {Failure} from '../response-utils'
import {HttpStatusCode} from '..'
import {Response} from 'express'

class QueryValidatior {
  response: Response

  constructor(response: Response) {
    this.response = response
  }

  /**
   * Validates query parameters for routes by ensureing specified variables are defined
   * @param object Array of values that must be defined
   * @return error data only
   */
  containsUndefinedValues(object: any): boolean {
    const values: string[] = this.getUndefinedValues(object)

    if (values.length == 0) {
      return false
    }

    const parameters: string = this.getUndefinedParameters(values)
    const s = this.getSingluarOrPluralStringEnding(values)

    this.sendError({
      response: {
        error: `You must specify the ${parameters} query parameter${s}!`
      },
      statusCode: HttpStatusCode.NOT_ACCEPTABLE
    })

    return true
  }

  private getSingluarOrPluralStringEnding(values: any[]): string {
    return values.length > 1 ? 's' : ''
  }

  private getUndefinedParameters(values: string[]): string {
    return values.join(values.length == 2 ? ' and ' : ', ')
  }

  private getUndefinedValues(object: any): string[] {
    const values: string[] = []

    for (const value in object) {
      if (!object[value]) {
        values.push(value)
      }
    }

    return values
  }

  /**
   * @param key API key required for API services
   * @return error data only
   */
  containsInvalidKey(key: string): boolean {
    if (key != process.env.RESEARCH_API_KEY) {
      this.sendError({
        response: {
          error: 'A valid API key is required to perform this function.'
        },
        statusCode: HttpStatusCode.UNAUTHORIZED
      })
      return true
    }
    return false
  }

  sendError(failure: Failure) {
    this.response.status(failure.statusCode).send(failure.response)
  }
}

export {QueryValidatior}
