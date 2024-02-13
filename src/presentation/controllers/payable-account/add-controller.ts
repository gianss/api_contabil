import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'
import { AddService } from '@/domain/usecases/repositories'
import { PayableAccountRequest } from '@/presentation/dtos/payable-accounts-request'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class AddPayableAccountController implements ControllerHandler<PayableAccountRequest> {
    constructor(
        private readonly addPayableAccountsRepository: AddService<PayableAccountRequest, PayableAccounts>,
        private readonly validation: Validation
    ) { }

    async handle(request: PayableAccountRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { observation, amount, frequency, due_date, status, supplier_id } = request
            const suppliers = await this.addPayableAccountsRepository.add({ observation, amount, frequency, due_date, status, supplier_id })
            return ok({ data: suppliers })
        } catch (error) {
            return serverError(error)
        }
    }
}
