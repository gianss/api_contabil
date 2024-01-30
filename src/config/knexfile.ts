import * as path from 'path'
import knex from 'knex'
import config from './config'

const knexConnection = {
    client: config.db_client,
    connection: {
        host: config.db_host,
        user: config.db_user,
        password: config.db_password,
        database: config.db_database
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: path.resolve(__dirname, '../migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, '../seeders')
    }
}

export default knexConnection

export const db = knex(knexConnection)
