import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable('payable_accounts', (table) => {
        table.increments('id').primary()
        table.integer('supplier_id').unsigned().notNullable()
        table.foreign('supplier_id').references('id').inTable('suppliers')
        table.text('observation').nullable()
        table.decimal('amount').notNullable()
        table.integer('frequency').notNullable()
        table.date('due_date').notNullable()
        table.enum('status', ['pending', 'paid', 'late']).defaultTo('pending')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('payable_accounts')
}
