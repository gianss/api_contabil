import { Suppliers } from '@/domain/protocols/suppliers'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'
import { AddService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { SuppliersRequest } from '@/presentation/dtos/suppliers-request'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class AddSuppliersController implements ControllerHandler<SuppliersRequest> {
    constructor(
        private readonly addSuppliersRepository: AddService<SuppliersRequest, Suppliers>,
        private readonly validation: Validation,
        private readonly verifyEmailSuppliersService: VerifyEmailUsedService
    ) { }

    async handle(request: SuppliersRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, status, company_id } = request
            const emailIsUsed = await this.verifyEmailSuppliersService.verifyEmail(email)
            if (emailIsUsed) {
                return badRequest(new EmailInUseError())
            }
            const suppliers = await this.addSuppliersRepository.add({ name, email, phone, status, company_id })
            return ok({ data: suppliers })
        } catch (error) {
            return serverError(error)
        }
    }
}
