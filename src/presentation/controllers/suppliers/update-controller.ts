import { Suppliers } from '@/domain/protocols/suppliers'
import { GetIdService, UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { UpdateControllerHandler } from '@/domain/usecases/controllers/update-controller-handle'
import { SuppliersRequest } from '@/presentation/dtos/suppliers-request'
import { EmailInUseError, InvalidParamError } from '@/presentation/errors'
import { acessDenied, badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

export class UpdateSupplierController implements UpdateControllerHandler<SuppliersRequest> {
    constructor(
        private readonly updateSuppliersRepository: UpdateService<SuppliersRequest, Suppliers>,
        private readonly validation: Validation,
        private readonly verifyEmailSuppliersRepository: VerifyEmailUsedService,
        private readonly getSuppliersIdRepository: GetIdService<Suppliers>
    ) { }

    async handle(request: SuppliersRequest, id: number): Promise<HttpResponse> {
        try {
            if (isNaN(id)) {
                return badRequest(new InvalidParamError('id'))
            }
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, phone, status } = request
            const singleSuppliers = await this.getSuppliersIdRepository.getId(id)
            if (singleSuppliers.company_id !== request.loggedUser.company_id) {
                return acessDenied()
            }
            const emailIsUsed = await this.verifyEmailSuppliersRepository.verifyEmail(email, id)
            if (emailIsUsed) {
                return badRequest(new EmailInUseError())
            }
            const suppliers = await this.updateSuppliersRepository.update({ name, email, phone, status, company_id: singleSuppliers.company_id }, id)
            return ok({ data: suppliers })
        } catch (error) {
            return serverError(error)
        }
    }
}
