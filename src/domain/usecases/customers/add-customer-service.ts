import { Customer } from '@/domain/protocols/customer'
import { AddCustomerRequest } from '@/presentation/dtos/add-customer-request'

export interface AddCustomerService {
    add(request: AddCustomerRequest): Promise<Customer | undefined>
}
