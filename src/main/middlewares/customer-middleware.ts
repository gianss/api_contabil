import { Request, Response } from 'express'
import { CustomerRepository } from '@/infra/repositories/customer-repository'
import { AddCustomerController } from '@/presentation/controllers/customers/add-customer-controller'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'
import { Validation } from '@/validation/protocols'

export class CustomerMiddleware {
    private readonly customerRepository: CustomerRepository

    constructor() {
        this.customerRepository = new CustomerRepository()
    }

    add = async (req: Request, res: Response): Promise<void> => {
        const emailValidator = new EmailValidatorAdapter()
        const validations: Validation[] = [
            new RequiredFieldValidation('name'),
            new RequiredFieldValidation('email'),
            new EmailValidation('email', emailValidator)
        ]
        const validation = new ValidationComposite(validations)
        const addCustomerController = new AddCustomerController(this.customerRepository, validation, this.customerRepository)
        const response = await addCustomerController.handle({ ...req.body, company_id: req.user.company_id })
        res.status(response.statusCode).json(response.body)
    }
}
