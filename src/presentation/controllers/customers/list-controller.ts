import { Customer } from '@/domain/protocols/customer'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'
import { ListService, ListTotalService } from '@/domain/usecases/repositories'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'

export class ListCustomerController implements ControllerHandler<any> {
    constructor(
        private readonly listCustomerRepository: ListService<Customer>,
        private readonly listTotalCustomerRepository: ListTotalService
    ) { }

    async handle(request: any): Promise<HttpResponse> {
        try {
            const customers = await this.listCustomerRepository.getAll(request)
            const total = await this.listTotalCustomerRepository.getTotal(request)
            return ok({ customers, total })
        } catch (error) {
            return serverError(error)
        }
    }
}
