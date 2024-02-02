import { Customer } from '@/domain/protocols/customer'
import { AddCustomerRequest } from '@/presentation/dtos/customer-request'

export interface AddCustomerService {
    add(request: AddCustomerRequest): Promise<Customer | undefined>
}
