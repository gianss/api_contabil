import dotenv from 'dotenv'
dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    db_client: process.env.DBCLIENT || 'mysql2',
    db_host: process.env.HOSTDB || '127.0.0.1',
    db_user: process.env.USERDB || 'gian',
    db_password: process.env.DBPASSWORD || '3636',
    db_database: process.env.DBDATABASE || 'app_db'
}

export default config
