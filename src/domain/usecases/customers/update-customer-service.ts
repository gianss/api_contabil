import { Customer } from '@/domain/protocols/customer'
import { CustomerRequest } from '@/presentation/dtos/customer-request'

export interface UpdateCustomerService {
    update(request: CustomerRequest, id: number): Promise<Customer | undefined>
}
