import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable('appointments', (table) => {
        table.increments('id').primary()
        table.integer('customer_id').unsigned().notNullable()
        table.foreign('customer_id').references('id').inTable('customers')
        table.dateTime('appointment_datetime').notNullable()
        table.enum('status', ['scheduled', 'completed', 'canceled']).defaultTo('scheduled')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('appointments')
}
