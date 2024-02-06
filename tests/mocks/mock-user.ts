
import { User } from '@/domain/protocols/user'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { UserRequest } from '@/presentation/dtos/user-request'
import { faker } from '@faker-js/faker'

const bcryptAdapter = new BcryptAdapter(10)

export const userRequest = async (type: string): Promise<UserRequest> => ({
    email: faker.internet.email(),
    password: await bcryptAdapter.hash('123'),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    document: '',
    avatar: '',
    type: type,
    status: 'active',
    company_id: 1
})

export const userResponse = async (type: string): Promise<User> => ({
    ...await userRequest(type),
    id: faker.number.int(),
    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime()
})
