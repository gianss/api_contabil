import { Customer } from '@/domain/protocols/customer'
import { User } from '@/domain/protocols/user'
import { DeleteControllerHandler } from '@/domain/usecases/controllers/delete-controller-handle'
import { GetIdService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { acessDenied, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class DeleteCustomerController implements DeleteControllerHandler {
    constructor(
        private readonly deleteCustomerRepository: DeleteItemService<Customer>,
        private readonly getCustomerIdRepository: GetIdService<Customer>
    ) { }

    async handle(id: number, loggedUser: User): Promise<HttpResponse> {
        try {
            const singleCustomer = await this.getCustomerIdRepository.getId(id)
            if (singleCustomer.company_id !== loggedUser.company_id) {
                return acessDenied()
            }
            const deletedCustomer = await this.deleteCustomerRepository.delete(id)
            return ok(deletedCustomer)
        } catch (error) {
            return serverError(error)
        }
    }
}
