
import { Customer } from '@/domain/protocols/customer'
import { CustomerRequest } from '@/presentation/dtos/customer-request'
import { faker } from '@faker-js/faker'

export const customerRequest = (): CustomerRequest => ({
    phone: faker.phone.number(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    status: 'active',
    type: 'scheduling',
    avatar: '',
    company_id: 1
})

export const customerResponse = (): Customer => ({
    ...customerRequest(),
    id: faker.number.int(),
    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime()
})
