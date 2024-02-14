
import { Suppliers } from '@/domain/protocols/suppliers'
import { GetIdService, UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { UpdateSupplierController } from '@/presentation/controllers/suppliers/'
import { SuppliersRequest } from '@/presentation/dtos/suppliers-request'
import { AccessDeniedError, InvalidParamError, MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { suppliersRequest, suppliersResponse } from '@/tests/mocks/mock-suppliers'
import { userResponse } from '@/tests/mocks/mock-user'
import { Validation } from '@/validation/protocols'
import { faker } from '@faker-js/faker'

const id = faker.number.int()

const request = suppliersRequest()
const response = suppliersResponse()
const userRes = userResponse('company')

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

class VerifyEmailSuppliersSpy implements VerifyEmailUsedService {
    async verifyEmail(email: string, id: number): Promise<boolean> {
        return false
    }
}

interface SutTypes {
    sut: UpdateSupplierController
    validationSpy: ValidationSpy
    verifyEmailSuppliersSpy: VerifyEmailSuppliersSpy
    updateSuppliersRepositorySpy: UpdateSuppliersRepositorySpy
    getSuppliersIdRepositorySpy: GetSuppliersIdRepositorySpy
}

class UpdateSuppliersRepositorySpy implements UpdateService<SuppliersRequest, Suppliers> {
    async update(request: SuppliersRequest, id: number): Promise<Suppliers | undefined> {
        return response
    }
}

class GetSuppliersIdRepositorySpy implements GetIdService<Suppliers> {
    async getId(id: number): Promise<Suppliers | undefined> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const verifyEmailSuppliersSpy = new VerifyEmailSuppliersSpy()
    const updateSuppliersRepositorySpy = new UpdateSuppliersRepositorySpy()
    const getSuppliersIdRepositorySpy = new GetSuppliersIdRepositorySpy()
    return {
        sut: new UpdateSupplierController(updateSuppliersRepositorySpy, validationSpy, verifyEmailSuppliersSpy, getSuppliersIdRepositorySpy),
        validationSpy,
        verifyEmailSuppliersSpy,
        updateSuppliersRepositorySpy,
        getSuppliersIdRepositorySpy
    }
}

describe('Update Suppliers Controller', () => {
    test('Should return status 200 if update is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return a suppliers if the request is successful', async () => {
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
        const { sut, verifyEmailSuppliersSpy } = makeSut()
        jest.spyOn(verifyEmailSuppliersSpy, 'verifyEmail').mockResolvedValueOnce(true)
        request.email = 'any_email.com.br'
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(400)
    })

    test('Should return status 500 if an error occurs', async () => {
        const { sut, verifyEmailSuppliersSpy } = makeSut()
        jest.spyOn(verifyEmailSuppliersSpy, 'verifyEmail').mockImplementationOnce(throwError)
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
