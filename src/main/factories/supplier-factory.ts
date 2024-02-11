import { AddSupplierRepository, DeleteSupplierRepository, GetSupplierIdRepository, ListSupplierRepository, TotalListSupplierRepository, UpdateSupplierRepository, VerifyEmailSupplierRepository } from '@/infra/repositories/supplier-repository'
import { AddSupplierController, DeleteSupplierController, ListSupplierController, UpdateSupplierController } from '@/presentation/controllers/suppliers/'
import { Validation } from '@/validation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'

export const listSupplierControllerFactory = (): ListSupplierController => {
    const listSupplierRepository = new ListSupplierRepository()
    const totalListSupplierRepository = new TotalListSupplierRepository()
    return new ListSupplierController(listSupplierRepository, totalListSupplierRepository)
}

export const addSupplierControllerFactory = (): AddSupplierController => {
    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = [
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('email'),
        new EmailValidation('email', emailValidator)
    ]
    const validation = new ValidationComposite(validations)
    const addRepository = new AddSupplierRepository()
    const verifyEmailSupplierRepository = new VerifyEmailSupplierRepository()
    return new AddSupplierController(addRepository, validation, verifyEmailSupplierRepository)
}

export const updateSupplierControllerFactory = (): UpdateSupplierController => {
    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = [
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('email'),
        new EmailValidation('email', emailValidator)
    ]
    const validation = new ValidationComposite(validations)
    const updateRepository = new UpdateSupplierRepository()
    const verifyEmailSupplierRepository = new VerifyEmailSupplierRepository()
    const getSupplierIdRepository = new GetSupplierIdRepository()
    return new UpdateSupplierController(updateRepository, validation, verifyEmailSupplierRepository, getSupplierIdRepository)
}

export const pathSupplierControllerFactory = (request: any): UpdateSupplierController => {
    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = []
    if (request.email) {
        validations.push(new EmailValidation('email', emailValidator))
    }
    const validation = new ValidationComposite(validations)
    const updateRepository = new UpdateSupplierRepository()
    const verifyEmailSupplierRepository = new VerifyEmailSupplierRepository()
    const getSupplierIdRepository = new GetSupplierIdRepository()
    return new UpdateSupplierController(updateRepository, validation, verifyEmailSupplierRepository, getSupplierIdRepository)
}

export const deleteSupplierControllerFactory = (): DeleteSupplierController => {
    const deleteRepository = new DeleteSupplierRepository()
    const getSupplierIdRepository = new GetSupplierIdRepository()
    return new DeleteSupplierController(deleteRepository, getSupplierIdRepository)
}
