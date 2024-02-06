
import { Customer } from '@/domain/protocols/customer'
import { GetIdService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { DeleteCustomerController } from '@/presentation/controllers/customers/delete-controller'
import { throwError } from '@/tests/mocks'
import { customerResponse } from '@/tests/mocks/mock-customer'
import { userResponse } from '@/tests/mocks/mock-user'

const response = customerResponse()
const userRes = userResponse('company')

interface SutTypes {
    sut: DeleteCustomerController
    deleteCustomerRepositorySpy: DeleteCustomerRepositorySpy
    getCustomerIdRepositorySpy: GetCustomerIdRepositorySpy
}

class DeleteCustomerRepositorySpy implements DeleteItemService<Customer> {
    async delete(id: number): Promise<Customer> {
        return response
    }
}

class GetCustomerIdRepositorySpy implements GetIdService<Customer> {
    async getId(id: number): Promise<Customer | undefined> {
        return response
    }
}

const makeSut = (): SutTypes => {
    const deleteCustomerRepositorySpy = new DeleteCustomerRepositorySpy()
    const getCustomerIdRepositorySpy = new GetCustomerIdRepositorySpy()
    return {
        sut: new DeleteCustomerController(deleteCustomerRepositorySpy, getCustomerIdRepositorySpy),
        deleteCustomerRepositorySpy,
        getCustomerIdRepositorySpy
    }
}

describe('List delete Customer Controller', () => {
    test('should return status 200 if delete is successful', async () => {
        const { sut } = makeSut()
        const data = await sut.handle(response.id, await userRes)
        expect(data.statusCode).toEqual(200)
    })

    test('Should return status 500 if an unexpected error occurs', async () => {
        const { sut, deleteCustomerRepositorySpy } = makeSut()
        jest.spyOn(deleteCustomerRepositorySpy, 'delete').mockImplementationOnce(throwError)
        const data = await sut.handle(response.id, await userRes)
        expect(data.statusCode).toEqual(500)
    })
})
