import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/auth-middleware'
import { SupplierMiddleware } from '../middlewares/supplier-middleware'

const router = Router()
const supplierMiddleware = new SupplierMiddleware()
const authMiddleware = new AuthMiddleware()

router.use(authMiddleware.checkPermissions(['administrator', 'company']))

router.get('/', supplierMiddleware.list)
router.post('/', supplierMiddleware.add)
router.put('/:id', supplierMiddleware.putUpdate)
router.patch('/:id', supplierMiddleware.patchUpdate)
router.delete('/:id', supplierMiddleware.delete)

export default router
