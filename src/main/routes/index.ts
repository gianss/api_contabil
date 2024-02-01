import fs from 'fs'
import { Router } from 'express'
const routes = Router()
fs.readdirSync('./src/routes').forEach(async (file) => {
  const fileName = file.split('.')[0]
  if (fileName === 'index') return
  const route = await import(`./${fileName}`)
  routes.use(`/${fileName}`, route.default)
})
export default routes
