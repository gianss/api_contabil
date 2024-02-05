import { Customer } from '@/domain/protocols/customer'
import { AddCustomerService, VerifyEmailCustomerService } from '@/domain/usecases/customers'
import { db } from '@/infra/config/knexfile'
import { CustomerRequest } from '@/presentation/dtos/customer-request'

export class CustomerRepository implements AddCustomerService, VerifyEmailCustomerService {
    async add(request: CustomerRequest): Promise<Customer> {
        const id = await db('customers').insert(request)
        return await db('customers').where('id', id[0]).first()
    }

    async verify(email: string, id: number = null): Promise<boolean> {
        const customer = await db('customers').where('email', email).andWhere(function (): void {
            if (id) {
                this.where('id', id)
            }
        }).first()
        if (customer) {
            return true
        }
        return false
    }
}
