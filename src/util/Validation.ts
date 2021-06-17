import {Response} from 'express'

/**
 * Validates query parameters for routes by ensureing specified variables are defined
 * @param object Array of values that must be defined
 * @param response Response to send an error message to the sender
 * @return True if at least one value is are undefined, false if all are defined
 */
const containsUndefinedValues = (object: any, response: Response): boolean => {
  const values: String[] = [] // Undefined values]

  for (const value in object) {
    if (!object[value]) {
      values.push(value)
    }
  }

  if (values.length == 0) {
    return false
  }

  const parameters: string = values.join(values.length == 2 ? ' and ' : ', '),
    s = values.length > 1 ? 's' : ''

  response
    .status(422)
    .send(
      new ErrorMessage(
        'Missing query parameters.',
        `You must specify the ${parameters} query parameter${s}!`
      )
    )
  return true
}

/**
 * @param key API key required for API services
 * @param response Response to send an error message to the sender
 * @return True if the key is invalid or undefined, false if the key is valid
 */
const containsInvalidKey = (
  key: string | undefined,
  response: Response
): boolean => {
  if (key && key == process.env.RESEARCH_API_KEY) {
    return false
  }

  let message: string

  if (!key) {
    message = 'An API key is required to perform this function.'
  } else {
    message = 'The specified API key is invalid.'
  }

  response.status(422).send(new ErrorMessage('API Key Required', message))
  return true
}

/**
 * @param {String} String1
 * @param {String} String2
 * @returns True only if given strings are equal regardless of casing
 */
const equalsIgnoreCase = (string1: string, string2: string): boolean =>
  string1 && string2 && string1.toUpperCase() === string2.toUpperCase()
    ? true
    : false

/**
 * @param {String} String
 * @returns True only if given strings are equal regardless of casing
 */
const equalsTrue = (string: string): boolean => equalsIgnoreCase(string, 'true')

export {
  containsUndefinedValues,
  containsInvalidKey,
  equalsIgnoreCase,
  equalsTrue
}

/**
 * Used for returning errors in query validation only.
 */
class ErrorMessage {
  error: string
  message: string

  constructor(error: string, message: string) {
    this.error = error
    this.message = message
  }
}
