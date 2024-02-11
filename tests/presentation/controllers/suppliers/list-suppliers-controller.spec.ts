import { Suppliers } from '@/domain/protocols/suppliers'
import { ListService, ListTotalService } from '@/domain/usecases/repositories'
import { ListSuppliersController } from '@/presentation/controllers/suppliers/'
import { throwError } from '@/tests/mocks'

interface SutTypes {
    sut: ListSuppliersController
    listSuppliersRepositorySpy: ListSuppliersRepositorySpy
    listTotalSuppliersRepositorySpy: ListTotalSuppliersRepositorySpy
}

class ListSuppliersRepositorySpy implements ListService<Suppliers> {
    async getAll(request: any): Promise<Suppliers[]> {
        return []
    }
}

class ListTotalSuppliersRepositorySpy implements ListTotalService {
    async getTotal(request: any): Promise<number> {
        return 0
    }
}

const makeSut = (): SutTypes => {
    const listSuppliersRepositorySpy = new ListSuppliersRepositorySpy()
    const listTotalSuppliersRepositorySpy = new ListTotalSuppliersRepositorySpy()
    return {
        sut: new ListSuppliersController(listSuppliersRepositorySpy, listTotalSuppliersRepositorySpy),
        listSuppliersRepositorySpy,
        listTotalSuppliersRepositorySpy
    }
}

describe('List Suppliers Controller', () => {
    test('Should return status 200 if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(200)
    })

    test('Should return an array if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(Array.isArray(response.body.supplierss)).toBe(true)
        expect(typeof response.body.total).toBe('number')
    })

    test('Should return status 500 if an error is thrown', async () => {
        const { sut, listSuppliersRepositorySpy } = makeSut()
        jest.spyOn(listSuppliersRepositorySpy, 'getAll').mockImplementationOnce(throwError)
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(500)
    })
})
