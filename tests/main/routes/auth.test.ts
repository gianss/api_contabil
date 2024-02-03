import request from 'supertest'
import server from '@/main/index'

afterAll((done) => {
    server.close(done) // Feche o servidor após todos os testes
})

describe('Auth Middleware Integration Test', () => {
    test('should return a successful response when login is valid', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email: 'gian_ss@live.com',
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
