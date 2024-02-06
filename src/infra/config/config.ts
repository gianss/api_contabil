import dotenv from 'dotenv'
dotenv.config({ path: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}` })

const config = {
    port: process.env.PORT || 4000,
    db_client: process.env.DBCLIENT || 'mysql2',
    db_host: process.env.HOSTDB || '127.0.0.1',
    db_user: process.env.USERDB || 'gian',
    db_password: process.env.DBPASSWORD || '3636',
    db_database: process.env.DBDATABASE || 'app_db',
    jwt_key: process.env.JWTKEY || 'any_key'
}

export default config
