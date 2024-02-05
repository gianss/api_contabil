import { Customer } from '@/domain/protocols/customer'

export interface GetCustomerIdService {
    getId(id: number): Promise<Customer | undefined>
}
