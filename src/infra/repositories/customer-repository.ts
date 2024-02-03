import { Customer } from '@/domain/protocols/customer'
import { AddCustomerService, VerifyEmailCustomerService } from '@/domain/usecases/customers'
import { db } from '@/infra/config/knexfile'
import { AddCustomerRequest } from '@/presentation/dtos/customer-request'

export class CustomerRepository implements AddCustomerService, VerifyEmailCustomerService {
    async add(request: AddCustomerRequest): Promise<Customer> {
        const id = await db('customers').insert(request)
        return await db('customers').where('id', id[0]).first()
    }

    async verify(email: string): Promise<boolean> {
        const customer = await db('customers').where('email', email).first()
        if (customer) {
            return true
        }
        return false
    }
}
