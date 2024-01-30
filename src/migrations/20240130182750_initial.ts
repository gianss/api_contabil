import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return await knex.schema
        .createTable('clientes', (table) => {
            table.increments('id').primary()
            table.string('nome').notNullable()
            table.string('email').unique().notNullable()
            table.enum('status', ['ativo', 'inativo']).defaultTo('ativo')
            table.timestamps(true, true)
        })
        .createTable('fornecedores', (table) => {
            table.increments('id').primary()
            table.string('nome').notNullable()
            table.string('email').unique().notNullable()
            table.enum('status', ['ativo', 'inativo']).defaultTo('ativo')
            table.timestamps(true, true)
        })
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema
        .dropTable('clientes')
        .dropTable('fornecedores')
}
