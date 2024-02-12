import { Request, Response } from 'express'
import {
    addSupplierControllerFactory,
    deleteSupplierControllerFactory,
    listSupplierControllerFactory,
    pathSupplierControllerFactory,
    updateSupplierControllerFactory
} from '../factories/supplier-factory'

export class SupplierMiddleware {
    public list = async (req: Request, res: Response): Promise<void> => {
        const controller = listSupplierControllerFactory()
        const response = await controller.handle({ ...req.query, loggedUser: req.user })
        res.status(response.statusCode).json(response.body)
    }

    public add = async (req: Request, res: Response): Promise<void> => {
        const controller = addSupplierControllerFactory()
        const response = await controller.handle({ ...req.body, company_id: req.user.company_id })
        res.status(response.statusCode).json(response.body)
    }

    public putUpdate = async (req: Request, res: Response): Promise<void> => {
        const controller = updateSupplierControllerFactory()
        const response = await controller.handle({ ...req.body, loggedUser: req.user }, parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }

    public patchUpdate = async (req: Request, res: Response): Promise<void> => {
        const controller = pathSupplierControllerFactory(req.body)
        const response = await controller.handle(req.body, parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const controller = deleteSupplierControllerFactory()
        const response = await controller.handle(parseInt(req.params.id), req.user)
        res.status(response.statusCode).json(response.body)
    }
}
