
import { PayableAccounts } from '@/domain/protocols/payable-accounts'
import { PayableAccountRequest } from '@/presentation/dtos//payable-accounts-request'
import { faker } from '@faker-js/faker'

export const payableAccountRequest = (): PayableAccountRequest => ({
    observation: faker.lorem.lines(3),
    amount: faker.number.float(2),
    supplier_id: faker.number.int(),
    due_date: faker.date.future(),
    frequency: 1,
    status: 'active'
})

export const payableAccountResponse = (): PayableAccounts => ({
    ...payableAccountRequest(),
    id: faker.number.int(),
    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime()
})
