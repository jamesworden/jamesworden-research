enum Status {
  OK = 'Success!',
  INTERNAL_ERROR = 'There was an error processing your request.'
}

type ErrorMessage<Type> = {
  error: string
  status: Status
  data?: Type
}

type Data<Type> = {
  data: Type
  status: Status
}

/**
 * Todo: Change name so it doesn't conflict with Express
 */
type Response<Type> = ErrorMessage<Type> | Data<Type>

export {Status, Response, Data}
