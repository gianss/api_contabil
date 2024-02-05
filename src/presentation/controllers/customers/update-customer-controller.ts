import { UpdateCustomerService, VerifyEmailCustomerService } from '@/domain/usecases/customers'
import { UpdateControllerHandler } from '@/domain/usecases/update-controller-handle'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class UpdateCustomerController implements UpdateControllerHandler<CustomerRequest> {
    constructor(
        private readonly updateCustomerService: UpdateCustomerService,
        private readonly validation: Validation,
        private readonly verifyEmailCustomerService: VerifyEmailCustomerService
    ) { }

    async handle(request: CustomerRequest, id: number): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, type, status, company_id, avatar } = request
            const emailIsUsed = await this.verifyEmailCustomerService.verify(email, id)
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
