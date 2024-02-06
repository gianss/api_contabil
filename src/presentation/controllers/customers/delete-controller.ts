import { Customer } from '@/domain/protocols/customer'
import { DeleteControllerHandler } from '@/domain/usecases/controllers/delete-controller-handle'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class DeleteCustomerController implements DeleteControllerHandler {
    constructor(
        private readonly deleteCustomerRepository: DeleteItemService<Customer>
    ) { }

    async handle(id: number): Promise<HttpResponse> {
        try {
            const deletedCustomer = await this.deleteCustomerRepository.delete(id)
            return ok(deletedCustomer)
        } catch (error) {
            return serverError(error)
        }
    }
}
