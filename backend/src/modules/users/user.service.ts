import jwt from 'jsonwebtoken'

import { BadRequest, NotFound } from '../../exceptions/ApiException'
import {
    getAllUsersFromDb,
    getSumAmountOfType,
    getTransactionsFromDb,
    insertTransaction,
    transferFunds,
    validateUser,
} from './user.repository'

const secret = process.env.JWT_SECRET ?? 'JWT_SECRET'

const jwtOptions = { expiresIn: '24h' }

/** Login */
async function loginUser({ fields }) {
    const { name = '', password = '' } = fields

    try {
        const [user] = await validateUser(name, password)

        if (!user) throw NotFound({ user: 'User does not exist.' })

        const token = jwt.sign(user, secret, jwtOptions)

        return { token, user }
    } catch (e) {
        console.error(`User login failed, ${name},`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
        return Promise.reject(e)
    }
}

/** Get Transactions */
async function getTransactions({ fields }) {
    const { userId = '' } = fields

    try {
        return await getTransactionsFromDb(userId)
    } catch (e) {
        console.error(`User not found, ${userId},`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
        return Promise.reject(e)
    }
}

/** Transfer */
async function transfer({ fields }) {
    const { to, amount, from } = fields

    const [deposits] = await getSumAmountOfType(from, 'DEPOSIT')
    const [withdrawals] = await getSumAmountOfType(from, 'WITHDRAW')

    // @ts-ignore
    const total = deposits.amount - withdrawals.amount
    if (Number.isNaN(total)) throw BadRequest({ total: 'Total is not a number' })
    // @ts-ignore
    if (total === 0 || total < amount)
        throw BadRequest({ total: 'No sufficient Fund' })

    await transferFunds({ to, amount, from })

    try {
        return { to, amount, from }
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Get All Users */
async function getAllUsers() {
    try {
        return await getAllUsersFromDb()
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Deposit/Withdraw */
async function transact({ fields }) {
    const { amount = 0, userId, type = 'DEPOSIT' } = fields

    try {
        if (type === 'WITHDRAW') {
            const [deposits] = await getSumAmountOfType(userId, 'DEPOSIT')
            const [withdrawals] = await getSumAmountOfType(userId, 'WITHDRAW')

            // @ts-ignore
            const total = deposits.amount - withdrawals.amount
            if (Number.isNaN(total))
                throw BadRequest({ total: 'Total is not a number' })
            // @ts-ignore
            if (total === 0 || deposits.amount < withdrawals.amount)
                throw BadRequest({ total: 'No sufficient Fund' })
        }

        await insertTransaction(userId, amount, type)

        return await getTransactions({ fields })
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Service */
function userService() {
    return {
        loginUser,
        getTransactions,
        transact,
        getAllUsers,
        transfer,
    }
}

export default userService
