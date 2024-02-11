import { Suppliers } from '@/domain/protocols/suppliers'
import { User } from '@/domain/protocols/user'
import { DeleteControllerHandler } from '@/domain/usecases/controllers/delete-controller-handle'
import { GetIdService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { acessDenied, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class DeleteSupplierController implements DeleteControllerHandler {
    constructor(
        private readonly deleteSuppliersRepository: DeleteItemService<Suppliers>,
        private readonly getSuppliersIdRepository: GetIdService<Suppliers>
    ) { }

    async handle(id: number, loggedUser: User): Promise<HttpResponse> {
        try {
            const singleSuppliers = await this.getSuppliersIdRepository.getId(id)
            if (singleSuppliers.company_id !== loggedUser.company_id) {
                return acessDenied()
            }
            const deletedSuppliers = await this.deleteSuppliersRepository.delete(id)
            return ok({ deletedItem: deletedSuppliers })
        } catch (error) {
            return serverError(error)
        }
    }
}
