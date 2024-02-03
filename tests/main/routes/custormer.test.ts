import request from 'supertest'
import server from '@/main/index'
import { faker } from '@faker-js/faker'

let authToken: string
let authTokenNotAllowed: string
beforeAll(async () => {
    const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email: 'gian_ss@live.com', password: '123' })
    authToken = loginResponse.body.token

    const loginResponseNotAllowed = await request(server)
        .post('/auth/login')
        .send({ email: 'igorfals@gmail.com', password: '123' })
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
