
import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { GetIdService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { DeletePayableAccountController } from '@/presentation/controllers/payable-account'
import { throwError } from '@/tests/mocks'
import { payableAccountResponse } from '@/tests/mocks/mock-payable-account'
import { userResponse } from '@/tests/mocks/mock-user'

const response = payableAccountResponse()
const userRes = userResponse('company')

interface SutTypes {
    sut: DeletePayableAccountController
    deletePayableAccountsRepositorySpy: DeletePayableAccountsRepositorySpy
    getPayableAccountsIdRepositorySpy: GetPayableAccountsIdRepositorySpy
}

class DeletePayableAccountsRepositorySpy implements DeleteItemService<PayableAccounts> {
    async delete(id: number): Promise<PayableAccounts> {
        return response
    }
}

class GetPayableAccountsIdRepositorySpy implements GetIdService<PayableAccounts> {
    async getId(id: number): Promise<PayableAccounts | undefined> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const deletePayableAccountsRepositorySpy = new DeletePayableAccountsRepositorySpy()
    const getPayableAccountsIdRepositorySpy = new GetPayableAccountsIdRepositorySpy()
    return {
        sut: new DeletePayableAccountController(deletePayableAccountsRepositorySpy, getPayableAccountsIdRepositorySpy),
        deletePayableAccountsRepositorySpy,
        getPayableAccountsIdRepositorySpy
    }
}

describe('List delete PayableAccounts Controller', () => {
    test('should return status 200 if delete is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(response.id, await userRes)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return status 500 if an unexpected error occurs', async () => {
        const { sut, deletePayableAccountsRepositorySpy } = makeSut()
        jest.spyOn(deletePayableAccountsRepositorySpy, 'delete').mockImplementationOnce(throwError)
        const data = await sut.handle(response.id, await userRes)
        expect(data.statusCode).toEqual(500)
    })
})
