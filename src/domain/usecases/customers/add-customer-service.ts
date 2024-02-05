import { Customer } from '@/domain/protocols/customer'
import { CustomerRequest } from '@/presentation/dtos/customer-request'

export interface AddCustomerService {
    add(request: CustomerRequest): Promise<Customer | undefined>
}
