
import { Suppliers } from '@/domain/protocols/suppliers'
import { GetIdService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { DeleteSupplierController } from '@/presentation/controllers/suppliers/'
import { throwError } from '@/tests/mocks'
import { suppliersResponse } from '@/tests/mocks/mock-suppliers'
import { userResponse } from '@/tests/mocks/mock-user'

const response = suppliersResponse()
const userRes = userResponse('company')

interface SutTypes {
    sut: DeleteSupplierController
    deleteSuppliersRepositorySpy: DeleteSuppliersRepositorySpy
    getSuppliersIdRepositorySpy: GetSuppliersIdRepositorySpy
}

class DeleteSuppliersRepositorySpy implements DeleteItemService<Suppliers> {
    async delete(id: number): Promise<Suppliers> {
        return response
    }
}

class GetSuppliersIdRepositorySpy implements GetIdService<Suppliers> {
    async getId(id: number): Promise<Suppliers | undefined> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const deleteSuppliersRepositorySpy = new DeleteSuppliersRepositorySpy()
    const getSuppliersIdRepositorySpy = new GetSuppliersIdRepositorySpy()
    return {
        sut: new DeleteSupplierController(deleteSuppliersRepositorySpy, getSuppliersIdRepositorySpy),
        deleteSuppliersRepositorySpy,
        getSuppliersIdRepositorySpy
    }
}

describe('List delete Suppliers Controller', () => {
    test('should return status 200 if delete is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(response.id, await userRes)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return status 500 if an unexpected error occurs', async () => {
        const { sut, deleteSuppliersRepositorySpy } = makeSut()
        jest.spyOn(deleteSuppliersRepositorySpy, 'delete').mockImplementationOnce(throwError)
        const data = await sut.handle(response.id, await userRes)
        expect(data.statusCode).toEqual(500)
    })
})
