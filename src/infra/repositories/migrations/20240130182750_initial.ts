import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema
        .createTable('customers', (table) => {
            table.increments('id').primary()
            table.string('name').notNullable()
            table.string('phone').nullable()
            table.string('email').unique().nullable()
            table.enum('status', ['active', 'inactive']).defaultTo('active')
            table.enum('customer_type', ['receivable', 'scheduling']).defaultTo('scheduling')
            table.timestamps(true, true)
        })
        .createTable('suppliers', (table) => {
            table.increments('id').primary()
            table.string('name').notNullable()
            table.string('phone').nullable()
            table.string('email').unique().nullable()
            table.enum('status', ['active', 'inactive']).defaultTo('active')
            table.timestamps(true, true)
        })
        .createTable('users', (table) => {
            table.increments('id').primary()
            table.string('name').notNullable()
            table.string('email').unique().notNullable()
            table.string('phone').nullable()
            table.string('password').notNullable()
            table.string('document').nullable()
            table.string('avatar').nullable()
            table.enum('status', ['active', 'inactive']).defaultTo('active')
            table.enum('type', ['administrator', 'company', 'barber', 'customer']).defaultTo('company')
            table.timestamps(true, true)
        })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema
        .dropTable('customers')
        .dropTable('suppliers')
        .dropTable('users')
}
