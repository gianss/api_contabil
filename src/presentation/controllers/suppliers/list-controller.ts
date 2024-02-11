import { Suppliers } from '@/domain/protocols/suppliers'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'
import { ListService, ListTotalService } from '@/domain/usecases/repositories'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class ListSuppliersController implements ControllerHandler<any> {
    constructor(
        private readonly listSuppliersRepository: ListService<Suppliers>,
        private readonly listTotalSuppliersRepository: ListTotalService
    ) { }

    async handle(request: any): Promise<HttpResponse> {
        try {
            const supplierss = await this.listSuppliersRepository.getAll(request)
            const total = await this.listTotalSuppliersRepository.getTotal(request)
            return ok({ total, supplierss })
        } catch (error) {
            return serverError(error)
        }
    }
}
