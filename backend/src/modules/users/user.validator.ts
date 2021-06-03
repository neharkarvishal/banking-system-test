import Joi from 'joi'

export const loginUserSchema = Joi.object({
    name: Joi.string().min(2).required().label('User Name'),

    password: Joi.string().required().min(2).max(360).label('Password'),
})

export const depositSchema = Joi.object({
    amount: Joi.number().integer().required().label('Amount'),

    type: Joi.string().required().valid('DEPOSIT', 'WITHDRAW').label('Type'),
})

export const transferSchema = Joi.object({
    to: Joi.number().integer().required().label('To'),

    amount: Joi.number().integer().required().label('amount'),
})
