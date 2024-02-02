import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema
        .createTable('personalized_sheet', (table) => {
            table.increments('id').primary()
            table.integer('customer_id').unsigned().notNullable()
            table.foreign('customer_id').references('id').inTable('customers')
            table.text('title').notNullable()
            table.text('observation').nullable()
            table.json('quiz').nullable()
            table.enum('status', ['active', 'inactive']).defaultTo('active')
            table.timestamps(true, true)
        })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('personalized_sheet')
}
