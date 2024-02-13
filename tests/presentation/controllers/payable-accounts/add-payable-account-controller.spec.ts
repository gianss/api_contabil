import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { Validation } from '@/validation/protocols'
import { AddPayableAccountController } from '@/presentation/controllers/payable-account/add-controller'
import { MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { PayableAccountRequest } from '@/presentation/dtos/payable-accounts-request'
import { AddService } from '@/domain/usecases/repositories'
import { payableAccountRequest, payableAccountResponse } from '@/tests/mocks/mock-payable-account'

const request = payableAccountRequest()
const response = payableAccountResponse()

interface SutTypes {
    sut: AddPayableAccountController
    addsuppliersRepositorySpy: AddPayableAccountsRepositorySpy
    validationSpy: ValidationSpy
}

class AddPayableAccountsRepositorySpy implements AddService<PayableAccountRequest, PayableAccounts> {
    async add(request: PayableAccountRequest): Promise<PayableAccounts | undefined> {
        return response
    }
}

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

const makeSut = (): SutTypes => {
    const addsuppliersRepositorySpy = new AddPayableAccountsRepositorySpy()
    const validationSpy = new ValidationSpy()
    return {
        sut: new AddPayableAccountController(addsuppliersRepositorySpy, validationSpy),
        addsuppliersRepositorySpy,
        validationSpy
    }
}

describe('Add PayableAccounts Controller', () => {
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

    test('Should return status 400 if validation fails', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(400)
    })

    test('Should return status 500 if an unexpected error occurs', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
        const data = await sut.handle(request)
        expect(data.statusCode).toEqual(500)
    })
})
