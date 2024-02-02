import { Customer } from '@/domain/protocols/customer'
import { AddCustomerRequest } from '@/presentation/dtos/add-customer-request'

export interface AddCustomerService {
    add(reqeust: AddCustomerRequest): Promise<Customer | undefined>
}
