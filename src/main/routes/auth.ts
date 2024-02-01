import { AuthMiddleware } from '@/main/middlewares/auth-middleware'
import { Router } from 'express'

const router = Router()
const authMiddleware = new AuthMiddleware()

router.post('/login', authMiddleware.login)

export default router
