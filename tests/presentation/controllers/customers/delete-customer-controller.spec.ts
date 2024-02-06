
import { Customer } from '@/domain/protocols/customer'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { DeleteCustomerController } from '@/presentation/controllers/customers/delete-controller'
import { throwError } from '@/tests/mocks'
import { customerResponse } from '@/tests/mocks/mock-customer'

const response = customerResponse()

interface SutTypes {
    sut: DeleteCustomerController
    deleteCustomerRepositorySpy: DeleteCustomerRepositorySpy
}

class DeleteCustomerRepositorySpy implements DeleteItemService<Customer> {
    async delete(id: number): Promise<Customer> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const deleteCustomerRepositorySpy = new DeleteCustomerRepositorySpy()
    return {
        sut: new DeleteCustomerController(deleteCustomerRepositorySpy),
        deleteCustomerRepositorySpy
    }
}

describe('List delete Customer Controller', () => {
    test('should return status 200 if delete is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(response.id)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return status 500 if an unexpected error occurs', async () => {
        const { sut, deleteCustomerRepositorySpy } = makeSut()
        jest.spyOn(deleteCustomerRepositorySpy, 'delete').mockImplementationOnce(throwError)
        const data = await sut.handle(response.id)
        expect(data.statusCode).toEqual(500)
    })
})
