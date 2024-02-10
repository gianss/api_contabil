import { Router } from 'express'
import { CustomerMiddleware } from '../middlewares/customer-middleware'
import { AuthMiddleware } from '../middlewares/auth-middleware'

const router = Router()
const customerMiddleware = new CustomerMiddleware()
const authMiddleware = new AuthMiddleware()

router.use(authMiddleware.checkPermissions(['administrator', 'company']))

router.get('/', customerMiddleware.list)
router.post('/', customerMiddleware.add)
router.put('/:id', customerMiddleware.putUpdate)
router.patch('/:id', customerMiddleware.patchUpdate)
router.delete('/:id', customerMiddleware.delete)

export default router
