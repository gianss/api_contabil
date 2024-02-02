import { Customer } from '@/domain/protocols/customer'

export interface AddCustomerService {
    add(email: string): Promise<Customer | undefined>
}
