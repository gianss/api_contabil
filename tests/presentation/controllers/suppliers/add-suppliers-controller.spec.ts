import { Suppliers } from '@/domain/protocols/suppliers'
import { Validation } from '@/validation/protocols'
import { AddSupplierController } from '@/presentation/controllers/suppliers/add-controller'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { SuppliersRequest } from '@/presentation/dtos/suppliers-request'
import { AddService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { suppliersRequest, suppliersResponse } from '@/tests/mocks/mock-suppliers'

const request = suppliersRequest()
const response = suppliersResponse()

interface SutTypes {
    sut: AddSupplierController
    addsuppliersRepositorySpy: AddSuppliersRepositorySpy
    validationSpy: ValidationSpy
    verifyEmailSuppliersSpy: VerifyEmailSuppliersSpy
}

class AddSuppliersRepositorySpy implements AddService<SuppliersRequest, Suppliers> {
    async add(request: SuppliersRequest): Promise<Suppliers | undefined> {
        return response
    }
}

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

class VerifyEmailSuppliersSpy implements VerifyEmailUsedService {
    async verifyEmail(email: string): Promise<boolean> {
        return false
    }
}

const makeSut = (): SutTypes => {
    const addsuppliersRepositorySpy = new AddSuppliersRepositorySpy()
    const validationSpy = new ValidationSpy()
    const verifyEmailSuppliersSpy = new VerifyEmailSuppliersSpy()
    return {
        sut: new AddSupplierController(addsuppliersRepositorySpy, validationSpy, verifyEmailSuppliersSpy),
        addsuppliersRepositorySpy,
        validationSpy,
        verifyEmailSuppliersSpy
    }
}

describe('Add Suppliers Controller', () => {
    test('Should return status 200 if registration is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return a suppliers if the request is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(request)
        expect(data.body.data).toBeDefined()
        expect(data.body.data).toEqual(response)
    })

    test('Should return status 400 if the email is already in use', async () => {
        const { sut, verifyEmailSuppliersSpy } = makeSut()
        jest.spyOn(verifyEmailSuppliersSpy, 'verifyEmail').mockResolvedValueOnce(true)
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
        const { sut, verifyEmailSuppliersSpy } = makeSut()
        jest.spyOn(verifyEmailSuppliersSpy, 'verifyEmail').mockImplementationOnce(throwError)
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(500)
    })
})
