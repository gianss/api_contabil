import { Customer } from '@/domain/protocols/customer'
import { AddService, GetIdService, ListService, ListTotalService, UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { db } from '@/infra/config/knexfile'
import { CustomerRequest } from '@/presentation/dtos/customer-request'

export class TotalListCustomerRepository implements ListTotalService {
    async getTotal(request: any): Promise<number> {
        const result: any = await db('customers').count('id as total').first()
        return result.total
    }
}

export class ListCustomerRepository implements ListService<Customer> {
    async getAll(request: any): Promise<Customer[]> {
        return await db('customers')
    }
}

export class GetCustomerIdRepository implements GetIdService<Customer> {
    async getId(id: number): Promise<Customer> {
        return await db('customers').where('id', id).first()
    }
}

export class AddCustomerRepository implements AddService<CustomerRequest, Customer> {
    async add(request: CustomerRequest): Promise<Customer> {
        const id = await db('customers').insert(request)
        return await db('customers').where('id', id[0]).first()
    }
}

export class VerifyEmailCustomerRepository implements VerifyEmailUsedService {
    async verifyEmail(email: string, id: number = null): Promise<boolean> {
        const customer = await db('customers').where('email', email).andWhere(function (): void {
            if (id) {
                this.where('id', '!=', id)
            }
        }).first()
        if (customer) {
            return true
        }
        return false
    }
}

export class UpdateCustomerRepository implements UpdateService<CustomerRequest, Customer> {
    async update(request: CustomerRequest, id: number): Promise<Customer> {
        await db('customers').update(request).where('id', id)
        return await db('customers').where('id', id).first()
    }
}

export class DeleteCustomerRepository implements DeleteItemService<Customer> {
    async delete(id: number): Promise<Customer> {
        const customer = await db('customers').where('id', id).first()
        await db('customers').where('id', id).del()
        return customer
    }
}
