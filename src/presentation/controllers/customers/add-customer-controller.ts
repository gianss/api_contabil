import { AddCustomerHandler } from '@/domain/usecases/customers/add-customer'
import { AddCustomerService } from '@/domain/usecases/customers/customer-service'
import { AddCustomerRequest } from '@/presentation/dtos/add-customer-request'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class AddCustomerController implements AddCustomerHandler {
    constructor(
        private readonly addCustomerRepositorie: AddCustomerService,
        private readonly validation: Validation
    ) { }

    async handle(request: AddCustomerRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, type, status, company_id, avatar } = request
            const customerResponse = await this.addCustomerRepositorie.add({ name, email, phone, type, status, company_id, avatar })
            return ok(customerResponse)
        } catch (error) {
            return serverError(error)
        }
    }
}
