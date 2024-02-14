import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'
import { ListService, ListTotalService } from '@/domain/usecases/repositories'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class ListPayableAccountController implements ControllerHandler<any> {
    constructor(
        private readonly listPayableAccountsRepository: ListService<PayableAccounts>,
        private readonly listTotalPayableAccountsRepository: ListTotalService
    ) { }

    async handle(request: any): Promise<HttpResponse> {
        try {
            const payableAccounts = await this.listPayableAccountsRepository.getAll(request)
            const total = await this.listTotalPayableAccountsRepository.getTotal(request)
            return ok({ total, payableAccounts })
        } catch (error) {
            return serverError(error)
        }
    }
}
