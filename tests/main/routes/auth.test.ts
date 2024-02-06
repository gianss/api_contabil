import request from 'supertest'
import server from '@/main/index'
import { db } from '@/infra/config/knexfile'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { faker } from '@faker-js/faker'

const email = faker.internet.email()

beforeAll(async () => {
    const bcryptAdapter = new BcryptAdapter(10)
    const user = {
        email: email,
        password: await bcryptAdapter.hash('123'),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        type: 'administrator',
        status: 'active',
        company_id: 1
    }
    await db('users').insert(user)
})

afterAll((done) => {
    server.close(done) // Feche o servidor após todos os testes
})

describe('Auth Middleware Integration Test', () => {
    test('should return a successful response when login is valid', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email: email,
                password: '123'
            })
        expect(response.status).toBe(200)
    })
    test('should return status 400 for invalid fields', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email: 'email_invalido',
                password: ''
            })
        expect(response.status).toBe(400)
    })
    test('should return status 401 for unauthorized login', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email: 'email_valido@teste.com',
                password: 'senha_valida'
            })
        expect(response.status).toBe(401)
    })
})
