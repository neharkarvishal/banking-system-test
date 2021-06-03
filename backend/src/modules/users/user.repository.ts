import { knex } from '../../knex'

export async function validateUser(name: string, password: string) {
    return knex<User>('users')
        .where({
            name,
            password,
        })
        .select('users.name as name', 'users.id as id', 'users.role as role')
}

export async function getTransactionsFromDb(userId: string) {
    return knex('users')
        .where({
            'users.id': userId,
        })
        .join('accounts', 'users.id', 'accounts.userId')
        .select(
            'users.id as userId',
            // 'users.name as user',
            'accounts.id as transactionsId',
            'accounts.amount as amount',
            'accounts.type as type',
        )
}

export async function getAllUsersFromDb() {
    const allUsers = await knex('users')
        .distinct('users.id')
        .join('accounts', 'users.id', 'accounts.userId')
        .select('users.id as id', 'users.name as name')

    const result: any[] = []

    // eslint-disable-next-line no-restricted-syntax
    for await (const user of allUsers) {
        const [deposits] = await getSumAmountOfType(user.id, 'DEPOSIT')
        const [withdrawals] = await getSumAmountOfType(user.id, 'WITHDRAW')

        // @ts-ignore
        const total = deposits.amount - withdrawals.amount
        result.push({ ...user, total })
    }

    return result
}

export async function getSumAmountOfType(
    userId: number,
    type: 'DEPOSIT' | 'WITHDRAW',
) {
    return knex<Account>('accounts')
        .where({
            userId,
            type,
        })
        .sum('amount as amount')
}

export async function insertTransaction(
    userId: number,
    amount: number,
    type: 'DEPOSIT' | 'WITHDRAW',
) {
    await knex<Account>('accounts').insert({
        userId,
        amount,
        type,
    })
}
