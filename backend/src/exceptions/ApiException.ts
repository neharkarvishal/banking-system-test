interface HttpExceptionParams {
    message: string
    status?: number
    errors?: any
}

export default class ApiException extends Error {
    errors: any

    status: number

    stack?: any

    constructor({ message, status = 500, errors }: HttpExceptionParams) {
        super(message) // 'Error' breaks prototype chain here

        this.status = status
        if (errors && Object.keys(errors).length) this.errors = errors
        Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = new Error(message).stack
        }
    }
}

/** `createError` helper for custom errors */
export const createError = ({ message, errors, status }) =>
    new ApiException({ message, errors, status })

export const BadRequest = (errors: unknown = undefined) =>
    new ApiException({ message: 'Bad Request', status: 400, errors })

export const Unauthorized = (errors: unknown = undefined) =>
    new ApiException({ message: 'Unauthorized', status: 401, errors })

export const Forbidden = (errors: unknown = undefined) =>
    new ApiException({ message: 'Forbidden', status: 403, errors })

export const NotFound = (errors: unknown = undefined) =>
    new ApiException({ message: 'Not Found', status: 404, errors })

export const Conflict = (errors: unknown = undefined) =>
    new ApiException({ message: 'Conflict', status: 409, errors })

export const TooManyRequests = (errors: unknown = undefined) =>
    new ApiException({ message: 'Too Many Requests', status: 429, errors })

export const InternalServerError = (errors: unknown = undefined) =>
    new ApiException({ message: 'Internal Server Error', status: 500, errors })
