import * as dotenv from 'dotenv'
dotenv.config()
export const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'API Barber',
        version: '1.0.0'
    },
    servers: [
        {
            url: '/',
            description: 'Local server'
        }
    ]
}
