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
