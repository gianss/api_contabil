import request from 'supertest'
import server from '@/main/index'
import { faker } from '@faker-js/faker'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { db } from '@/infra/config/knexfile'

let authToken: string
let authTokenNotAllowed: string

beforeAll(async () => {
    const bcryptAdapter = new BcryptAdapter(10)
    const users = [
        {
            email: faker.internet.email(),
            password: await bcryptAdapter.hash('123'),
            name: faker.person.fullName(),
            phone: faker.phone.number(),
            type: 'administrator',
            status: 'active',
            company_id: 1
        },
        {
            email: faker.internet.email(),
            password: await bcryptAdapter.hash('123'),
            name: faker.person.fullName(),
            phone: faker.phone.number(),
            type: 'employee',
            status: 'active',
            company_id: 1
        }
    ]
    await db('users').insert(users)

    const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email: users[0].email, password: '123' })
    authToken = loginResponse.body.token

    const loginResponseNotAllowed = await request(server)
        .post('/auth/login')
        .send({ email: users[1].email, password: '123' })
    authTokenNotAllowed = loginResponseNotAllowed.body.token
})

afterAll((done) => {
    server.close(done) // Feche o servidor após todos os testes
})

describe('Customer Endpoint Tests', () => {
    test('should create a customer with a valid token', async () => {
        const response = await request(server)
            .post('/customer')
            .set('x-access-token', authToken)
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
    })

    test('should return status 400 if missingParams', async () => {
        const response = await request(server)
            .post('/customer')
            .set('x-access-token', authToken)
            .send({ name: faker.person.fullName() })
        expect(response.status).toBe(400)
    })

    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .post('/customer')
            .set('x-access-token', 'any_token')
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })

    test('should return 401 if not allowed', async () => {
        const response = await request(server)
            .post('/customer')
            .set('x-access-token', authTokenNotAllowed)
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })
})
