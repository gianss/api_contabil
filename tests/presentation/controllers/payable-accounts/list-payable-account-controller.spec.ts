import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { ListService, ListTotalService } from '@/domain/usecases/repositories'
import { ListPayableAccountController } from '@/presentation/controllers/payable-account'
import { throwError } from '@/tests/mocks'

interface SutTypes {
    sut: ListPayableAccountController
    listPayableAccountsRepositorySpy: ListPayableAccountsRepositorySpy
    listTotalPayableAccountsRepositorySpy: ListTotalPayableAccountsRepositorySpy
}

class ListPayableAccountsRepositorySpy implements ListService<PayableAccounts> {
    async getAll(request: any): Promise<PayableAccounts[]> {
        return []
    }
}

class ListTotalPayableAccountsRepositorySpy implements ListTotalService {
    async getTotal(request: any): Promise<number> {
        return 0
    }
}

const makeSut = (): SutTypes => {
    const listPayableAccountsRepositorySpy = new ListPayableAccountsRepositorySpy()
    const listTotalPayableAccountsRepositorySpy = new ListTotalPayableAccountsRepositorySpy()
    return {
        sut: new ListPayableAccountController(listPayableAccountsRepositorySpy, listTotalPayableAccountsRepositorySpy),
        listPayableAccountsRepositorySpy,
        listTotalPayableAccountsRepositorySpy
    }
}

describe('List PayableAccounts Controller', () => {
    test('Should return status 200 if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(200)
    })

    test('Should return an array if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        console.log(typeof response.body.total)
        expect(Array.isArray(response.body.payableAccounts)).toBe(true)
        expect(typeof response.body.total).toBe('number')
    })

    test('Should return status 500 if an error is thrown', async () => {
        const { sut, listPayableAccountsRepositorySpy } = makeSut()
        jest.spyOn(listPayableAccountsRepositorySpy, 'getAll').mockImplementationOnce(throwError)
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(500)
    })
})
