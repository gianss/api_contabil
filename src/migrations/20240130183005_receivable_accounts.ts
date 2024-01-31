import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable('receivable_accounts', (table) => {
        table.increments('id').primary()
        table.integer('customer_id').unsigned().notNullable()
        table.foreign('customer_id').references('id').inTable('customers')
        table.decimal('amount').notNullable()
        table.date('due_date').notNullable()
        table.integer('frequency').notNullable()
        table.enum('status', ['pending', 'received', 'late']).defaultTo('pending')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('receivable_accounts')
}
