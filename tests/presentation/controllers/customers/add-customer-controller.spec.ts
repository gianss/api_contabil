import { Customer } from '@/domain/protocols/customer'
import { Validation } from '@/validation/protocols'
import { faker } from '@faker-js/faker'
import { AddCustomerController } from '@/presentation/controllers/customers/add-customer-controller'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { AddService, VerifyEmailUsedService } from '@/domain/usecases/repositories'

const customerRequest: CustomerRequest = {
    phone: faker.phone.number(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    status: 'active',
    type: 'scheduling',
    avatar: '',
    company_id: faker.number.int()
}

const customerResponse: Customer = {
    ...customerRequest,
    id: faker.number.int(),
    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime()
}

interface SutTypes {
    sut: AddCustomerController
    addcustomerRepositorySpy: AddCustomerRepositorySpy
    validationSpy: ValidationSpy
    verifyEmailCustomerSpy: VerifyEmailCustomerSpy
}

class AddCustomerRepositorySpy implements AddService<CustomerRequest, Customer> {
    async add(request: CustomerRequest): Promise<Customer | undefined> {
        return customerResponse
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

describe('addCustomerController', () => {
    test('should return status 200 if add is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return a customer if the request is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(customerRequest)
        expect(response.body.data).toBeDefined()
        expect(response.body.data).toEqual(customerResponse)
    })

    test('should return status 400 if email in use', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockResolvedValueOnce(true)
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if validation fail', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if thrown', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockImplementationOnce(throwError)
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(500)
    })
})
