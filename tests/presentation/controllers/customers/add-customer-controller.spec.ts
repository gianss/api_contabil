import { Customer } from '@/domain/protocols/customer'
import { AddCustomerService } from '@/domain/usecases/customers/customer-service'
import { AddCustomerRequest } from '@/presentation/dtos/add-customer-request'
import { Validation } from '@/validation/protocols'
import { faker } from '@faker-js/faker'
import { AddCustomerController } from '@/presentation/controllers/customers/add-customer-controller'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'

const customerRequest: AddCustomerRequest = {
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
    customerRepositorieSpy: CustomerRepositorieSpy
    validationSpy: ValidationSpy
}

class CustomerRepositorieSpy implements AddCustomerService {
    async add(email: string): Promise<Customer | undefined> {
        return customerResponse
    }
}

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

const makeSut = (): SutTypes => {
    const customerRepositorieSpy = new CustomerRepositorieSpy()
    const validationSpy = new ValidationSpy()
    return {
        sut: new AddCustomerController(customerRepositorieSpy, validationSpy),
        customerRepositorieSpy,
        validationSpy
    }
}

describe('addCustomerController', () => {
    test('should return status 200 if add is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return status 400 if validation fail', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if thrown', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
        const response = await sut.handle(customerRequest)
        expect(response.statusCode).toEqual(500)
    })
})
