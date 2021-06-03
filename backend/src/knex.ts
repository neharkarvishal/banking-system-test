/* eslint-disable @typescript-eslint/naming-convention */
import K from 'knex'

export const knex = K({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: () => ({
        filename: './bank.sqlite',
    }),
})

export default async () => {
    try {
        return knex
    } catch (e) {
        console.error(e)
        return Promise.reject(e)
    }
}

// eslint-disable-next-line no-void
void (async () => {
    try {
        await knex.schema
            .createTableIfNotExists('users', (table) => {
                table.increments('id')
                table.string('name')
                table.string('password')
                table.string('role').defaultTo('USER')
                table.timestamps(true, true)
            })
            .createTableIfNotExists('accounts', (table) => {
                table.increments('id')
                table.integer('amount')
                table.string('type').defaultTo('DEPOSIT')
                table.integer('userId').unsigned().references('users.id')
                table.timestamps(true, true)
            })

        // seed one user
        if (!(await knex('users').count())[0]['count(*)']) {
            await knex('users').insert({
                id: 1,
                name: 'abc',
                password: 'abc',
                role: 'USER',
            })
            await knex('users').insert({
                id: 2,
                name: 'admin',
                password: 'admin',
                role: 'ADMIN',
            })
        }
    } catch (e) {
        console.error(e)
    }
})()
