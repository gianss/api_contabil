import fs from 'fs'
import { Router } from 'express'
const routes = Router()
fs.readdirSync('./src/routes').forEach(async (file) => {
  const fileName = file.split('.')[0]
  const [routeName, spec] = fileName.split('/')
  if (fileName === 'index') return
  if (spec === 'spec') return
  const route = await import(`./${file}/${fileName}`)
  routes.use(`/${routeName}`, route.default)
})
export default routes
