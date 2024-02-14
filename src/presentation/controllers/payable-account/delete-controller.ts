import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { User } from '@/domain/protocols/user'
import { DeleteControllerHandler } from '@/domain/usecases/controllers/delete-controller-handle'
import { GetIdService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { acessDenied, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class DeletePayableAccountController implements DeleteControllerHandler {
    constructor(
        private readonly deletePayableAccountsRepository: DeleteItemService<PayableAccounts>,
        private readonly getPayableAccountsIdRepository: GetIdService<PayableAccounts>
    ) { }

    async handle(id: number, loggedUser: User): Promise<HttpResponse> {
        try {
            const singlePayableAccounts = await this.getPayableAccountsIdRepository.getId(id)
            if (singlePayableAccounts.company_id !== loggedUser.company_id) {
                return acessDenied()
            }
            const deletedPayableAccounts = await this.deletePayableAccountsRepository.delete(id)
            return ok({ deletedItem: deletedPayableAccounts })
        } catch (error) {
            return serverError(error)
        }
    }
}
