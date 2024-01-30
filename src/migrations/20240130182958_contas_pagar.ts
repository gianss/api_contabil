import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable('contas_a_pagar', (table) => {
        table.increments('id').primary()
        table.integer('fornecedor_id').unsigned().notNullable()
        table.foreign('fornecedor_id').references('id').inTable('fornecedores')
        table.decimal('valor').notNullable()
        table.date('data_vencimento').notNullable()
        table.enum('status', ['pendente', 'pago']).defaultTo('pendente')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('contas_a_pagar')
}
