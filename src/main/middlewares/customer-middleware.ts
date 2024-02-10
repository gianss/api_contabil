import { Request, Response } from 'express'
import { addCustomerControllerFactory, deleteCustomerControllerFactory, listCustomerControllerFactory, pathCustomerControllerFactory, updateCustomerControllerFactory } from '../factories/customer-factory'

export class CustomerMiddleware {
    public list = async (req: Request, res: Response): Promise<void> => {
        const controller = listCustomerControllerFactory()
        const response = await controller.handle({ ...req.query, loggedUser: req.user })
        res.status(response.statusCode).json(response.body)
    }

    public add = async (req: Request, res: Response): Promise<void> => {
        const controller = addCustomerControllerFactory()
        const response = await controller.handle({ ...req.body, company_id: req.user.company_id })
        res.status(response.statusCode).json(response.body)
    }

    public putUpdate = async (req: Request, res: Response): Promise<void> => {
        const controller = updateCustomerControllerFactory()
        const response = await controller.handle({ ...req.body, loggedUser: req.user }, parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }

    public patchUpdate = async (req: Request, res: Response): Promise<void> => {
        const controller = pathCustomerControllerFactory(req.body)
        const response = await controller.handle(req.body, parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const controller = deleteCustomerControllerFactory()
        const response = await controller.handle(parseInt(req.params.id), req.user)
        res.status(response.statusCode).json(response.body)
    }
}
