import { Customer } from '@/domain/protocols/customer'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'
import { AddService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class AddCustomerController implements ControllerHandler<CustomerRequest> {
    constructor(
        private readonly addCustomerRepository: AddService<CustomerRequest, Customer>,
        private readonly validation: Validation,
        private readonly verifyEmailCustomerService: VerifyEmailUsedService
    ) { }

    async handle(request: CustomerRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, type, status, company_id, avatar } = request
            const emailIsUsed = await this.verifyEmailCustomerService.verifyEmail(email)
            if (emailIsUsed) {
                return badRequest(new EmailInUseError())
            }
            const customer = await this.addCustomerRepository.add({ name, email, phone, type, status, company_id, avatar })
            return ok({ data: customer })
        } catch (error) {
            return serverError(error)
        }
    }
}
