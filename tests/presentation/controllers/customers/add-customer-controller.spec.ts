import { Customer } from '@/domain/protocols/customer'
import { Validation } from '@/validation/protocols'
import { AddCustomerController } from '@/presentation/controllers/customers/add-controller'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { AddService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { customerRequest, customerResponse } from '@/tests/mocks/mock-customer'

const request = customerRequest()
const response = customerResponse()

interface SutTypes {
    sut: AddCustomerController
    addcustomerRepositorySpy: AddCustomerRepositorySpy
    validationSpy: ValidationSpy
    verifyEmailCustomerSpy: VerifyEmailCustomerSpy
}

class AddCustomerRepositorySpy implements AddService<CustomerRequest, Customer> {
    async add(request: CustomerRequest): Promise<Customer | undefined> {
        return response
    }
}

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

class VerifyEmailCustomerSpy implements VerifyEmailUsedService {
    async verifyEmail(email: string): Promise<boolean> {
        return false
    }
}

const makeSut = (): SutTypes => {
    const addcustomerRepositorySpy = new AddCustomerRepositorySpy()
    const validationSpy = new ValidationSpy()
    const verifyEmailCustomerSpy = new VerifyEmailCustomerSpy()
    return {
        sut: new AddCustomerController(addcustomerRepositorySpy, validationSpy, verifyEmailCustomerSpy),
        addcustomerRepositorySpy,
        validationSpy,
        verifyEmailCustomerSpy
    }
}

describe('Add Customer Controller', () => {
    test('Should return status 200 if registration is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return a customer if the request is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(request)
        expect(data.body.data).toBeDefined()
        expect(data.body.data).toEqual(response)
    })

    test('Should return status 400 if the email is already in use', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockResolvedValueOnce(true)
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(400)
    })

    test('Should return status 400 if validation fails', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(400)
    })

    test('Should return status 500 if an unexpected error occurs', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockImplementationOnce(throwError)
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(500)
    })
})
