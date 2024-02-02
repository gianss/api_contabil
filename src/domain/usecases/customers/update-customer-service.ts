import { Customer } from '@/domain/protocols/customer'
import { UpdateCustomerRequest } from '@/presentation/dtos/customer-request'

export interface UpdateCustomerService {
    add(request: UpdateCustomerRequest): Promise<Customer | undefined>
}
