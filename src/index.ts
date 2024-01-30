
import express from 'express'
import cors from 'cors'
import routes from './routes'
import config from './config/config'
const app = express()

const port = config.port

app.use(express.json())
app.use(cors())
app.use(routes)

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
})

export default app
