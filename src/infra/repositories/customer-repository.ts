import { Customer } from '@/domain/protocols/customer'
import { AddService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { db } from '@/infra/config/knexfile'
import { CustomerRequest } from '@/presentation/dtos/customer-request'

export class CustomerRepository implements AddService<CustomerRequest, Customer>, VerifyEmailUsedService {
    async add(request: CustomerRequest): Promise<Customer> {
        const id = await db('customers').insert(request)
        return await db('customers').where('id', id[0]).first()
    }

    async verifyEmail(email: string, id: number = null): Promise<boolean> {
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
