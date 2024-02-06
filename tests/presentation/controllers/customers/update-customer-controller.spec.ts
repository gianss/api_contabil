
import { Customer } from '@/domain/protocols/customer'
import { UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { UpdateCustomerController } from '@/presentation/controllers/customers/'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { Validation } from '@/validation/protocols'
import { faker } from '@faker-js/faker'

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

const id = faker.number.int()

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

class VerifyEmailCustomerSpy implements VerifyEmailUsedService {
    async verifyEmail(email: string, id: number): Promise<boolean> {
        return false
    }
}

interface SutTypes {
    sut: UpdateCustomerController
    validationSpy: ValidationSpy
    verifyEmailCustomerSpy: VerifyEmailCustomerSpy
    updateCustomerRepositorySpy: UpdateCustomerRepositorySpy
}

class UpdateCustomerRepositorySpy implements UpdateService<CustomerRequest, Customer> {
    async update(request: CustomerRequest, id: number): Promise<Customer | undefined> {
        return customerResponse
    }
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const verifyEmailCustomerSpy = new VerifyEmailCustomerSpy()
    const updateCustomerRepositorySpy = new UpdateCustomerRepositorySpy()
    return {
        sut: new UpdateCustomerController(updateCustomerRepositorySpy, validationSpy, verifyEmailCustomerSpy),
        validationSpy,
        verifyEmailCustomerSpy,
        updateCustomerRepositorySpy
    }
}

describe('updateCustomerController', () => {
    test('should return status 200 if update is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(customerRequest, id)
        expect(response.statusCode).toEqual(200)
    })

    test('should return a customer if the request is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(customerRequest, id)
        expect(response.body.data).toBeDefined()
        expect(response.body.data).toEqual(customerResponse)
    })

    test('should return status 400 if validation fail', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const response = await sut.handle(customerRequest, id)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if email in use (verifyEmailCustomerSpy = true)', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockResolvedValueOnce(true)
        customerRequest.email = 'any_email.com.br'
        const response = await sut.handle(customerRequest, id)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if thrown', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockImplementationOnce(throwError)
        const response = await sut.handle(customerRequest, id)
        expect(response.statusCode).toEqual(500)
    })
})
