import { Router } from 'express'
import { CustomerMiddleware } from '../middlewares/customer-middleware'
import { AuthMiddleware } from '../middlewares/auth-middleware'

const router = Router()
const customerMiddleware = new CustomerMiddleware()
const authMiddleware = new AuthMiddleware()

router.post('/', authMiddleware.checkPermissions(['administrator', 'company']), customerMiddleware.add)
router.put('/', authMiddleware.checkPermissions(['administrator', 'company']), customerMiddleware.putUpdate)
router.patch('/', authMiddleware.checkPermissions(['administrator', 'company']), customerMiddleware.patchUpdate)
router.delete('/:id', authMiddleware.checkPermissions(['administrator', 'company']), customerMiddleware.delete)

export default router
