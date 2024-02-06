import { Request, Response } from 'express'
import { CustomerRepository } from '@/infra/repositories/customer-repository'
import {
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite,
    PermissionValidation
} from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'
import { Validation } from '@/validation/protocols'
import {
    AddCustomerController,
    DeleteCustomerController,
    UpdateCustomerController
} from '@/presentation/controllers/customers'

export class CustomerMiddleware {
    private readonly customerRepository: CustomerRepository
    private readonly emailValidator: EmailValidatorAdapter

    constructor() {
        this.customerRepository = new CustomerRepository()
        this.emailValidator = new EmailValidatorAdapter()
    }

    public add = async (req: Request, res: Response): Promise<void> => {
        const validations: Validation[] = [
            new RequiredFieldValidation('name'),
            new RequiredFieldValidation('email'),
            new EmailValidation('email', this.emailValidator)
        ]
        const validation = new ValidationComposite(validations)
        const controller = new AddCustomerController(this.customerRepository, validation, this.customerRepository)
        const response = await controller.handle({ ...req.body, company_id: req.user.company_id })
        res.status(response.statusCode).json(response.body)
    }

    public putUpdate = async (req: Request, res: Response): Promise<void> => {
        const validations: Validation[] = [
            new PermissionValidation(req.user),
            new RequiredFieldValidation('id'),
            new RequiredFieldValidation('name'),
            new RequiredFieldValidation('email'),
            new EmailValidation('email', this.emailValidator)
        ]
        const validation = new ValidationComposite(validations)
        const controller = new UpdateCustomerController(this.customerRepository, validation, this.customerRepository)
        const response = await controller.handle(req.body, parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }

    public patchUpdate = async (req: Request, res: Response): Promise<void> => {
        const validations: Validation[] = [
            new PermissionValidation(req.user),
            new RequiredFieldValidation('id')
        ]
        if (req.body.email) {
            validations.push(new EmailValidation('email', this.emailValidator))
        }
        const validation = new ValidationComposite(validations)
        const controller = new UpdateCustomerController(this.customerRepository, validation, this.customerRepository)
        const response = await controller.handle(req.body, parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const controller = new DeleteCustomerController(this.customerRepository)
        const response = await controller.handle(parseInt(req.params.id))
        res.status(response.statusCode).json(response.body)
    }
}
