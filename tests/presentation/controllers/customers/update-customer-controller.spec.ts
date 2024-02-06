
import { Customer } from '@/domain/protocols/customer'
import { GetIdService, UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { UpdateCustomerController } from '@/presentation/controllers/customers/'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { AccessDeniedError, InvalidParamError, MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { customerRequest, customerResponse } from '@/tests/mocks/mock-customer'
import { userResponse } from '@/tests/mocks/mock-user'
import { Validation } from '@/validation/protocols'
import { faker } from '@faker-js/faker'

const id = faker.number.int()

const request = customerRequest()
const response = customerResponse()
const userRes = userResponse('company')

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
    getCustomerIdRepositorySpy: GetCustomerIdRepositorySpy
}

class UpdateCustomerRepositorySpy implements UpdateService<CustomerRequest, Customer> {
    async update(request: CustomerRequest, id: number): Promise<Customer | undefined> {
        return response
    }
}

class GetCustomerIdRepositorySpy implements GetIdService<Customer> {
    async getId(id: number): Promise<Customer | undefined> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const verifyEmailCustomerSpy = new VerifyEmailCustomerSpy()
    const updateCustomerRepositorySpy = new UpdateCustomerRepositorySpy()
    const getCustomerIdRepositorySpy = new GetCustomerIdRepositorySpy()
    return {
        sut: new UpdateCustomerController(updateCustomerRepositorySpy, validationSpy, verifyEmailCustomerSpy, getCustomerIdRepositorySpy),
        validationSpy,
        verifyEmailCustomerSpy,
        updateCustomerRepositorySpy,
        getCustomerIdRepositorySpy
    }
}

describe('Update Customer Controller', () => {
    test('Should return status 200 if update is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return a customer if the request is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.body.data).toBeDefined()
        expect(data.body.data).toEqual(response)
    })

    test('Should return status 400 if validation fails', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(400)
    })

    test('Should return status 400 if email is already in use', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockResolvedValueOnce(true)
        request.email = 'any_email.com.br'
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(400)
    })

    test('Should return status 500 if an error occurs', async () => {
        const { sut, verifyEmailCustomerSpy } = makeSut()
        jest.spyOn(verifyEmailCustomerSpy, 'verifyEmail').mockImplementationOnce(throwError)
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(500)
    })

    test('Should return status 400 if id is not a number', async () => {
        const { sut } = makeSut()
        const invalidId = 'test'
        const data = await sut.handle({ ...request, loggedUser: await userRes }, parseInt(invalidId))
        expect(data.statusCode).toEqual(400)
        expect(data.body).toEqual(new InvalidParamError('id'))
    })

    test('Should return status 403 if access denied', async () => {
        const { sut } = makeSut()
        const data = await sut.handle({ ...request, loggedUser: await { ...userRes, company_id: 3 } }, id)
        expect(data.statusCode).toEqual(403)
        expect(data.body).toEqual(new AccessDeniedError())
    })
})
