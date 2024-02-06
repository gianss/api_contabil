import { Customer } from '@/domain/protocols/customer'
import { ListService, ListTotalService } from '@/domain/usecases/repositories'
import { ListCustomerController } from '@/presentation/controllers/customers'
import { throwError } from '@/tests/mocks'

interface SutTypes {
    sut: ListCustomerController
    listCustomerRepositorySpy: ListCustomerRepositorySpy
    listTotalCustomerRepositorySpy: ListTotalCustomerRepositorySpy
}

class ListCustomerRepositorySpy implements ListService<Customer> {
    async getAll(request: any): Promise<Customer[]> {
        return []
    }
}

class ListTotalCustomerRepositorySpy implements ListTotalService {
    async getTotal(request: any): Promise<number> {
        return 0
    }
}

const makeSut = (): SutTypes => {
    const listCustomerRepositorySpy = new ListCustomerRepositorySpy()
    const listTotalCustomerRepositorySpy = new ListTotalCustomerRepositorySpy()
    return {
        sut: new ListCustomerController(listCustomerRepositorySpy, listTotalCustomerRepositorySpy),
        listCustomerRepositorySpy,
        listTotalCustomerRepositorySpy
    }
}

describe('List Customer Controller', () => {
    test('Should return status 200 if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(200)
    })

    test('Should return an array if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(Array.isArray(response.body.customers)).toBe(true)
        expect(typeof response.body.total).toBe('number')
    })

    test('Should return status 500 if an error is thrown', async () => {
        const { sut, listCustomerRepositorySpy } = makeSut()
        jest.spyOn(listCustomerRepositorySpy, 'getAll').mockImplementationOnce(throwError)
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(500)
    })
})
