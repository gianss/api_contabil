import { Customer } from '@/domain/protocols/customer'
import { AddCustomerService } from '@/domain/usecases/customers'
import { db } from '@/infra/config/knexfile'
import { AddCustomerRequest } from '@/presentation/dtos/customer-request'

export class CustomerRepository implements AddCustomerService {
    async add(request: AddCustomerRequest): Promise<Customer> {
        const id = await db('customers').insert(request)
        return await db('customers').where('id', id[0]).first()
    }
}
