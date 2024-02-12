import { Suppliers } from '@/domain/protocols/suppliers'
import { AddService, GetIdService, ListService, ListTotalService, UpdateService, VerifyEmailUsedService } from '@/domain/usecases/repositories'
import { DeleteItemService } from '@/domain/usecases/repositories/delete-item-service'
import { db } from '@/infra/config/knexfile'
import { SuppliersRequest } from '@/presentation/dtos/suppliers-request'

export class TotalListSupplierRepository implements ListTotalService {
    async getTotal(request: any): Promise<number> {
        const result: any = await db('suppliers')
            .count('id as total')
            .andWhere(function (): void {
                if (request.search) {
                    this.where('name', 'like', `%${request.search}%`)
                        .orWhere('email', 'like', `%${request.search}%`)
                }
            })
            .andWhere(function (): void {
                if (request.status) {
                    this.where('status', request.status)
                }
            })
            .andWhere(function (): void {
                if (request.cod_company) {
                    this.where('cod_company', request.cod_company)
                }
            })
            .first()
        return result.total
    }
}

export class ListSupplierRepository implements ListService<Suppliers> {
    async getAll(request: any): Promise<Suppliers[]> {
        return await db('suppliers')
            .andWhere(function (): void {
                if (request.search) {
                    this.where('name', 'like', `%${request.search}%`)
                        .orWhere('email', 'like', `%${request.search}%`)
                }
            })
            .andWhere(function (): void {
                if (request.status) {
                    this.where('status', request.status)
                }
            })
            .andWhere(function (): void {
                if (request.cod_company) {
                    this.where('cod_company', request.cod_company)
                }
            })
            .offset(request.offset || '0').limit(request.limit || 10)
    }
}

export class GetSupplierIdRepository implements GetIdService<Suppliers> {
    async getId(id: number): Promise<Suppliers> {
        return await db('suppliers').where('id', id).first()
    }
}

export class AddSupplierRepository implements AddService<SuppliersRequest, Suppliers> {
    async add(request: SuppliersRequest): Promise<Suppliers> {
        const id = await db('suppliers').insert(request)
        return await db('suppliers').where('id', id[0]).first()
    }
}

export class VerifyEmailSupplierRepository implements VerifyEmailUsedService {
    async verifyEmail(email: string, id: number = null): Promise<boolean> {
        const supplier = await db('suppliers').where('email', email).andWhere(function (): void {
            if (id) {
                this.where('id', '!=', id)
            }
        }).first()
        if (supplier) {
            return true
        }
        return false
    }
}

export class UpdateSupplierRepository implements UpdateService<SuppliersRequest, Suppliers> {
    async update(request: SuppliersRequest, id: number): Promise<Suppliers> {
        await db('suppliers').update(request).where('id', id)
        return await db('suppliers').where('id', id).first()
    }
}

export class DeleteSupplierRepository implements DeleteItemService<Suppliers> {
    async delete(id: number): Promise<Suppliers> {
        const supplier = await db('suppliers').where('id', id).first()
        await db('suppliers').where('id', id).del()
        return supplier
    }
}
