import express, { RequestHandler } from 'express'

import { BadRequest, NotFound } from '../../exceptions/ApiException'
import authMiddleware from '../../middlewares/auth.middleware'
import validator from '../../middlewares/validator.middleware'
import userService from './user.service'
import { depositSchema, loginUserSchema, transferSchema } from './user.validator'

const { loginUser, getTransactions, transact, getAllUsers, transfer } =
    userService()

const router = express.Router()

/** RequestHandler */
function loginUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await loginUser({ fields: req.body })

            res.status(200).json({
                data,
                status: 'ok',
            })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getTransactionsHandler(options): RequestHandler {
    return async (req, res, next) => {
        const { id } = req.user

        try {
            if (!id) throw NotFound({ user: 'User does not exist.' })

            const data = await getTransactions({ fields: { userId: id } })

            res.status(200).json({
                data,
                status: 'ok',
            })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getTransactionsByIdHandler(options): RequestHandler {
    return async (req, res, next) => {
        const { id } = req.params

        try {
            if (!id) throw NotFound({ user: 'User does not exist.' })

            const data = await getTransactions({ fields: { userId: id } })

            res.status(200).json({
                data,
                status: 'ok',
            })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function transferHandler(options): RequestHandler {
    return async (req, res, next) => {
        const { to, amount } = req.body
        const { id: from } = req.user

        try {
            if (to === from) throw BadRequest({ user: 'Cant transfer to yourself' })

            const data = await transfer({ fields: { to, amount, from } })

            res.status(200).json({
                data,
                status: 'ok',
            })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getAllUsersHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await getAllUsers()

            res.status(200).json({
                data,
                status: 'ok',
            })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function transactHandler(options): RequestHandler {
    return async (req, res, next) => {
        const { id } = req.user
        const { amount, type } = req.body

        try {
            if (!id) throw NotFound({ user: 'User does not exist.' })

            const data = await transact({ fields: { userId: id, amount, type } })

            res.status(200).json({
                data,
                status: 'ok',
            })
        } catch (e) {
            return next(e)
        }
    }
}

/** User Controller */
function userController(dependencies) {
    /** GET */
    router.get('/all', authMiddleware('ADMIN'), getAllUsersHandler(dependencies))

    /** GET */
    router.get(
        '/transactions/:id',
        authMiddleware('ADMIN'),
        getTransactionsByIdHandler(dependencies),
    )

    /** GET */
    router.get(
        '/transactions',
        authMiddleware(),
        getTransactionsHandler(dependencies),
    )

    /** POST */
    router.post(
        '/transact',
        validator(depositSchema),
        authMiddleware(),
        transactHandler(dependencies),
    )

    /** POST */
    router.post(
        '/transfer',
        validator(transferSchema),
        authMiddleware(),
        transferHandler(dependencies),
    )

    /** POST */
    router.post(
        '/login',
        validator(loginUserSchema),
        loginUserHandler(dependencies),
    )

    return router
}

export default userController
