
import { Suppliers } from '@/domain/protocols/suppliers'
import { SuppliersRequest } from '@/presentation/dtos/suppliers-request'
import { faker } from '@faker-js/faker'

export const suppliersRequest = (): SuppliersRequest => ({
    phone: faker.phone.number(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    status: 'active',
    company_id: 1
})

export const suppliersResponse = (): Suppliers => ({
    ...suppliersRequest(),
    id: faker.number.int(),
    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime()
})
