import { RequestHandler } from 'express'
import Joi from 'joi'

import { BadRequest } from '../exceptions/ApiException'

const getFormattedErrorMessages = (errors: Joi.ValidationError) =>
    errors.details
        .map((currentError) => {
            return { [currentError.path.join('.')]: currentError.message }
        })
        .reduce((accumulatedErrors, currentError) => {
            return { ...accumulatedErrors, ...currentError }
        }, {})

const validator = (
    schema: Joi.ObjectSchema,
    valueFrom: 'body' | 'query' | 'params' = 'body',
): RequestHandler => {
    return (req, res, next) => {
        try {
            if (!Joi.isSchema(schema)) throw new Error('Invalid Joi schema')

            const validation = schema.validate(req[valueFrom], {
                abortEarly: false,
                allowUnknown: false,
                errors: { wrap: { label: '' } },
            })

            if (validation.error)
                return next(BadRequest(getFormattedErrorMessages(validation.error)))

            return next()
        } catch (e) {
            return next(e)
        }
    }
}

export default validator
