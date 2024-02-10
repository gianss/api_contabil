import { AddCustomerRepository, DeleteCustomerRepository, GetCustomerIdRepository, ListCustomerRepository, TotalListCustomerRepository, UpdateCustomerRepository, VerifyEmailCustomerRepository } from '@/infra/repositories/customer-repository'
import { AddCustomerController, DeleteCustomerController, ListCustomerController, UpdateCustomerController } from '@/presentation/controllers/customers'
import { Validation } from '@/validation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'

export const listCustomerControllerFactory = (): ListCustomerController => {
    const listCustomerRepository = new ListCustomerRepository()
    const totalListCustomerRepository = new TotalListCustomerRepository()
    return new ListCustomerController(listCustomerRepository, totalListCustomerRepository)
}

export const addCustomerControllerFactory = (): AddCustomerController => {
    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = [
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('email'),
        new EmailValidation('email', emailValidator)
    ]
    const validation = new ValidationComposite(validations)
    const addRepository = new AddCustomerRepository()
    const verifyEmailCustomerRepository = new VerifyEmailCustomerRepository()
    return new AddCustomerController(addRepository, validation, verifyEmailCustomerRepository)
}

export const updateCustomerControllerFactory = (): UpdateCustomerController => {
    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = [
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('email'),
        new EmailValidation('email', emailValidator)
    ]
    const validation = new ValidationComposite(validations)
    const updateRepository = new UpdateCustomerRepository()
    const verifyEmailCustomerRepository = new VerifyEmailCustomerRepository()
    const getCustomerIdRepository = new GetCustomerIdRepository()
    return new UpdateCustomerController(updateRepository, validation, verifyEmailCustomerRepository, getCustomerIdRepository)
}

export const pathCustomerControllerFactory = (request: any): UpdateCustomerController => {
    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = []
    if (request.email) {
        validations.push(new EmailValidation('email', emailValidator))
    }
    const validation = new ValidationComposite(validations)
    const updateRepository = new UpdateCustomerRepository()
    const verifyEmailCustomerRepository = new VerifyEmailCustomerRepository()
    const getCustomerIdRepository = new GetCustomerIdRepository()
    return new UpdateCustomerController(updateRepository, validation, verifyEmailCustomerRepository, getCustomerIdRepository)
}

export const deleteCustomerControllerFactory = (): DeleteCustomerController => {
    const deleteRepository = new DeleteCustomerRepository()
    const getCustomerIdRepository = new GetCustomerIdRepository()
    return new DeleteCustomerController(deleteRepository, getCustomerIdRepository)
}
