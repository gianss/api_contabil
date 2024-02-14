
import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { GetIdService, UpdateService } from '@/domain/usecases/repositories'
import { PayableAccountRequest } from '@/presentation/dtos/payable-accounts-request'
import { AccessDeniedError, InvalidParamError, MissingParamError } from '@/presentation/errors'
import { throwError } from '@/tests/mocks'
import { payableAccountRequest, payableAccountResponse } from '@/tests/mocks/mock-payable-account'
import { userResponse } from '@/tests/mocks/mock-user'
import { Validation } from '@/validation/protocols'
import { faker } from '@faker-js/faker'
import { UpdatePayableAccountController } from '@/presentation/controllers/payable-account/update-controller'

const id = faker.number.int()

const request = payableAccountRequest()
const response = payableAccountResponse()
const userRes = userResponse('company')

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

interface SutTypes {
    sut: UpdatePayableAccountController
    validationSpy: ValidationSpy
    updatepayableAccountssRepositorySpy: UpdatepayableAccountssRepositorySpy
    getpayableAccountssIdRepositorySpy: GetpayableAccountssIdRepositorySpy
}

class UpdatepayableAccountssRepositorySpy implements UpdateService<PayableAccountRequest, PayableAccounts> {
    async update(request: PayableAccountRequest, id: number): Promise<PayableAccounts | undefined> {
        return response
    }
}

class GetpayableAccountssIdRepositorySpy implements GetIdService<PayableAccounts> {
    async getId(id: number): Promise<PayableAccounts | undefined> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const updatepayableAccountssRepositorySpy = new UpdatepayableAccountssRepositorySpy()
    const getpayableAccountssIdRepositorySpy = new GetpayableAccountssIdRepositorySpy()
    return {
        sut: new UpdatePayableAccountController(updatepayableAccountssRepositorySpy, validationSpy, getpayableAccountssIdRepositorySpy),
        validationSpy,
        updatepayableAccountssRepositorySpy,
        getpayableAccountssIdRepositorySpy
    }
}

describe('Update payableAccountss Controller', () => {
    test('Should return status 200 if update is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle({ ...request, loggedUser: await userRes }, id)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return a payableAccounts if the request is successful', async () => {
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

    test('Should return status 500 if an error occurs', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)
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
