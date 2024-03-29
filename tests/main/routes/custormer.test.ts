import request from 'supertest'
import server from '@/main/index'
import { faker } from '@faker-js/faker'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { db } from '@/infra/config/knexfile'

let authToken: string
let authTokenCompany: string
let authTokenCompany2: string
let authTokenNotAllowed: string
let customerId: any
let customer2Id: any
let company1Id: any
let company2Id: any

const customerAdd = {
    name: faker.person.fullName(),
    email: faker.internet.email()
}

const createAuthToken = async (email: string, type: string, company: number = 1): Promise<string> => {
    const bcryptAdapter = new BcryptAdapter(10)
    const passwordHash = await bcryptAdapter.hash('123')
    const user = {
        email,
        password: passwordHash,
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        type: type,
        status: 'active',
        company_id: company
    }
    await db('users').insert(user)
    const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email, password: '123' })
    return loginResponse.body.token
}

beforeAll(async () => {
    // Adiciona companys e obtém os IDs
    company1Id = await db('companys').insert({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        status: 'active'
    })
    company2Id = await db('companys').insert({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        status: 'active'
    })
    // Adiciona usuários com tokens
    authToken = await createAuthToken(faker.internet.email(), 'administrator', company1Id[0])
    authTokenCompany = await createAuthToken(faker.internet.email(), 'company', company1Id[0])
    authTokenCompany2 = await createAuthToken(faker.internet.email(), 'company', company2Id[0])
    authTokenNotAllowed = await createAuthToken(faker.internet.email(), 'employee', company1Id[0])

    // Adiciona clientes e obtém os IDs
    customerId = await db('customers').insert({ ...customerAdd, company_id: company1Id[0] })
    customer2Id = await db('customers').insert({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        company_id: company2Id[0]
    })
})

afterAll((done) => {
    server.close(done) // Feche o servidor após todos os testes
})

describe('Customer Endpoint ADD Tests', () => {
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

describe('Customer Endpoint Update Tests', () => {
    test('should update a customer with a valid token', async () => {
        const response = await request(server)
            .put(`/customer/${customerId[0]}`)
            .set('x-access-token', authTokenCompany)
            .send({ name: faker.person.fullName(), email: customerAdd.email })
        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
    })

    test('should return status 400 if the email is already in use', async () => {
        const response = await request(server)
            .put(`/customer/${customer2Id[0]}`)
            .set('x-access-token', authTokenCompany2)
            .send({ name: faker.person.fullName(), email: customerAdd.email })
        expect(response.status).toBe(400)
    })

    test('should return status 403 if you try to change content from other companies', async () => {
        const response = await request(server)
            .put(`/customer/${customerId[0]}`)
            .set('x-access-token', authTokenCompany2)
            .send({ name: faker.person.fullName(), email: customerAdd.email })
        expect(response.status).toBe(403)
    })

    test('should return 401 if not allowed', async () => {
        const response = await request(server)
            .put(`/customer/${customerId[0]}`)
            .set('x-access-token', authTokenNotAllowed)
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })

    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .put(`/customer/${customerId[0]}`)
            .set('x-access-token', 'any_token')
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })
})

describe('Customer Endpoint Delete Tests', () => {
    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .delete(`/customer/${customerId[0]}`)
            .set('x-access-token', 'any_token')
        expect(response.status).toBe(401)
    })

    test('should return 401 if not allowed', async () => {
        const response = await request(server)
            .delete(`/customer/${customerId[0]}`)
            .set('x-access-token', authTokenNotAllowed)
        expect(response.status).toBe(401)
    })

    test('should return status 403 if you try to change content from other companies', async () => {
        const response = await request(server)
            .delete(`/customer/${customerId[0]}`)
            .set('x-access-token', authTokenCompany2)
        expect(response.status).toBe(403)
    })

    test('should delete a customer with a valid token', async () => {
        const response = await request(server)
            .delete(`/customer/${customerId[0]}`)
            .set('x-access-token', authTokenCompany)
        expect(response.status).toBe(200)
    })
})

describe('Customer Endpoint List Tests', () => {
    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .get('/customer')
            .set('x-access-token', 'any_token')
        expect(response.status).toBe(401)
    })

    test('should return status 200 with an valid token', async () => {
        const response = await request(server)
            .get('/customer')
            .set('x-access-token', authTokenCompany)
        expect(response.status).toBe(200)
    })
})
