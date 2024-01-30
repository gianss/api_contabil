import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable('contas_a_receber', (table) => {
        table.increments('id').primary()
        table.integer('cliente_id').unsigned().notNullable()
        table.foreign('cliente_id').references('id').inTable('clientes')
        table.decimal('valor').notNullable()
        table.date('data_vencimento').notNullable()
        table.enum('status', ['pendente', 'recebido']).defaultTo('pendente')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('contas_a_receber')
}
