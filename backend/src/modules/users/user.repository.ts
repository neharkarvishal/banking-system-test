import { knex } from '../../knex'

export async function validateUser(name: string, password: string) {
    return knex('users')
        .where({
            name,
            password,
        })
        .select('users.name as name', 'users.id as id')
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

export async function getSumAmountOfType(type: 'DEPOSIT' | 'WITHDRAW') {
    return knex<Account>('accounts').where({ type }).sum('amount as amount')
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
