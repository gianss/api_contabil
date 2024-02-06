import { Customer } from '@/domain/protocols/customer'
import { GetIdService, UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { UpdateControllerHandler } from '@/domain/usecases/controllers/update-controller-handle'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { EmailInUseError, InvalidParamError } from '@/presentation/errors'
import { acessDenied, badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class UpdateCustomerController implements UpdateControllerHandler<CustomerRequest> {
    constructor(
        private readonly updateCustomerRepository: UpdateService<CustomerRequest, Customer>,
        private readonly validation: Validation,
        private readonly verifyEmailCustomerRepository: VerifyEmailUsedService,
        private readonly getCustomerIdRepository: GetIdService<Customer>
    ) { }

    async handle(request: CustomerRequest, id: number): Promise<HttpResponse> {
        try {
            if (isNaN(id)) {
                return badRequest(new InvalidParamError('id'))
            }
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, type, status, avatar } = request
            const singleCustomer = await this.getCustomerIdRepository.getId(id)
            if (singleCustomer.company_id !== request.loggedUser.company_id) {
                return acessDenied()
            }
            const emailIsUsed = await this.verifyEmailCustomerRepository.verifyEmail(email, id)
            if (emailIsUsed) {
                return badRequest(new EmailInUseError())
            }
            const customer = await this.updateCustomerRepository.update({ name, email, phone, type, status, company_id: singleCustomer.company_id, avatar }, id)
            return ok({ data: customer })
        } catch (error) {
            return serverError(error)
        }
    }
}
