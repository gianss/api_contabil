import { Customer } from '@/domain/protocols/customer'
import { UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { UpdateControllerHandler } from '@/domain/usecases/controllers/update-controller-handle'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class UpdateCustomerController implements UpdateControllerHandler<CustomerRequest> {
    constructor(
        private readonly updateCustomerService: UpdateService<CustomerRequest, Customer>,
        private readonly validation: Validation,
        private readonly verifyEmailCustomerService: VerifyEmailUsedService
    ) { }

    async handle(request: CustomerRequest, id: number): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, type, status, company_id, avatar } = request
            const emailIsUsed = await this.verifyEmailCustomerService.verifyEmail(email, id)
            if (emailIsUsed) {
                return badRequest(new EmailInUseError())
            }
            const customer = await this.updateCustomerService.update({ name, email, phone, type, status, company_id, avatar }, id)
            return ok({ data: customer })
        } catch (error) {
            return serverError(error)
        }
    }
}
