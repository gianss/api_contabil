import { AddCustomerService, VerifyEmailCustomerService } from '@/domain/usecases/customers'
import { AddCustomerHandler } from '@/domain/usecases/customers/add-customer'
import { AddCustomerRequest } from '@/presentation/dtos/add-customer-request'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class AddCustomerController implements AddCustomerHandler {
    constructor(
        private readonly addCustomerRepository: AddCustomerService,
        private readonly validation: Validation,
        private readonly verifyEmailCustomerService: VerifyEmailCustomerService
    ) { }

    async handle(request: AddCustomerRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, type, status, company_id, avatar } = request
            const emailIsUsed = await this.verifyEmailCustomerService.verify(email)
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
