import request from 'supertest'
import server from '@/main/index'
import { faker } from '@faker-js/faker'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { db } from '@/infra/config/knexfile'

let authToken: string
let authTokenCompany: string
let authTokenCompany2: string
let authTokenNotAllowed: string
let supplierId: any
let supplier2Id: any
let company1Id: any
let company2Id: any

const supplierAdd = {
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
    supplierId = await db('suppliers').insert({ ...supplierAdd, company_id: company1Id[0] })
    supplier2Id = await db('suppliers').insert({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        company_id: company2Id[0]
    })
})

afterAll((done) => {
    server.close(done) // Feche o servidor após todos os testes
})

describe('Supplier Endpoint ADD Tests', () => {
    test('should create a supplier with a valid token', async () => {
        const response = await request(server)
            .post('/supplier')
            .set('x-access-token', authToken)
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
    })

    test('should return status 400 if missingParams', async () => {
        const response = await request(server)
            .post('/supplier')
            .set('x-access-token', authToken)
            .send({ name: faker.person.fullName() })
        expect(response.status).toBe(400)
    })

    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .post('/supplier')
            .set('x-access-token', 'any_token')
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })

    test('should return 401 if not allowed', async () => {
        const response = await request(server)
            .post('/supplier')
            .set('x-access-token', authTokenNotAllowed)
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })
})

describe('Supplier Endpoint Update Tests', () => {
    test('should update a supplier with a valid token', async () => {
        const response = await request(server)
            .put(`/supplier/${supplierId[0]}`)
            .set('x-access-token', authTokenCompany)
            .send({ name: faker.person.fullName(), email: supplierAdd.email })
        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
    })

    test('should return status 400 if the email is already in use', async () => {
        const response = await request(server)
            .put(`/supplier/${supplier2Id[0]}`)
            .set('x-access-token', authTokenCompany2)
            .send({ name: faker.person.fullName(), email: supplierAdd.email })
        expect(response.status).toBe(400)
    })

    test('should return status 403 if you try to change content from other companies', async () => {
        const response = await request(server)
            .put(`/supplier/${supplierId[0]}`)
            .set('x-access-token', authTokenCompany2)
            .send({ name: faker.person.fullName(), email: supplierAdd.email })
        expect(response.status).toBe(403)
    })

    test('should return 401 if not allowed', async () => {
        const response = await request(server)
            .put(`/supplier/${supplierId[0]}`)
            .set('x-access-token', authTokenNotAllowed)
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })

    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .put(`/supplier/${supplierId[0]}`)
            .set('x-access-token', 'any_token')
            .send({ name: faker.person.fullName(), email: faker.internet.email() })
        expect(response.status).toBe(401)
    })
})

describe('Supplier Endpoint Delete Tests', () => {
    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .delete(`/supplier/${supplierId[0]}`)
            .set('x-access-token', 'any_token')
        expect(response.status).toBe(401)
    })

    test('should return 401 if not allowed', async () => {
        const response = await request(server)
            .delete(`/supplier/${supplierId[0]}`)
            .set('x-access-token', authTokenNotAllowed)
        expect(response.status).toBe(401)
    })

    test('should return status 403 if you try to change content from other companies', async () => {
        const response = await request(server)
            .delete(`/supplier/${supplierId[0]}`)
            .set('x-access-token', authTokenCompany2)
        expect(response.status).toBe(403)
    })

    test('should delete a supplier with a valid token', async () => {
        const response = await request(server)
            .delete(`/supplier/${supplierId[0]}`)
            .set('x-access-token', authTokenCompany)
        expect(response.status).toBe(200)
    })
})

describe('Supplier Endpoint List Tests', () => {
    test('should return unauthorized with an invalid token', async () => {
        const response = await request(server)
            .get('/supplier')
            .set('x-access-token', 'any_token')
        expect(response.status).toBe(401)
    })

    test('should return status 200 with an valid token', async () => {
        const response = await request(server)
            .get('/supplier')
            .set('x-access-token', authTokenCompany)
        expect(response.status).toBe(200)
    })
})
