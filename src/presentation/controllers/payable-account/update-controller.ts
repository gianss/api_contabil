import { GetIdService, UpdateService } from '@/domain/usecases/repositories'
import { UpdateControllerHandler } from '@/domain/usecases/controllers/update-controller-handle'
import { InvalidParamError } from '@/presentation/errors'
import { acessDenied, badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'
import { PayableAccountRequest } from '@/presentation/dtos/payable-accounts-request'
import { PayableAccounts } from '@/domain/protocols/payable-accounts'

export class UpdatePayableAccountController implements UpdateControllerHandler<PayableAccountRequest> {
    constructor(
        private readonly updatePayableAccountsRepository: UpdateService<PayableAccountRequest, PayableAccounts>,
        private readonly validation: Validation,
        private readonly getPayableAccountsIdRepository: GetIdService<PayableAccounts>
    ) { }

    async handle(request: PayableAccountRequest, id: number): Promise<HttpResponse> {
        try {
            if (isNaN(id)) {
                return badRequest(new InvalidParamError('id'))
            }
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { observation, amount, frequency, due_date, status, supplier_id } = request
            const singlePayableAccounts = await this.getPayableAccountsIdRepository.getId(id)
            if (singlePayableAccounts.company_id !== request.loggedUser.company_id) {
                return acessDenied()
            }
            const suppliers = await this.updatePayableAccountsRepository.update({ observation, amount, frequency, due_date, status, supplier_id }, id)
            return ok({ data: suppliers })
        } catch (error) {
            return serverError(error)
        }
    }
}
