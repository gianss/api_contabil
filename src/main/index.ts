
import express from 'express'
import cors from 'cors'
import routes from './routes'
import config from '../infra/config/config'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerDefinition } from '@/main/documentation/swagger'

const app = express()

const port = config.port

const options = {
    swaggerDefinition,
    apis: ['./src/main/documentation/*.yaml']
}
const sawggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(sawggerSpec))

app.use(express.json())
app.use(cors())
app.use(routes)
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const server = app.listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`🚀 Server running on port ${port}`)
    }
})

export default server
