
import express from 'express'
import cors from 'cors'
import routes from './routes'
import config from '../infra/config/config'
const app = express()

const port = config.port

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
