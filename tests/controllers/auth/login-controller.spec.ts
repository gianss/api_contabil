import { HttpResponse } from '@/utils/protocols/http-response'
import { LoginController } from '@/controllers/auth/login-controller'
import { User } from '@/interfaces/user'
import { faker } from '@faker-js/faker'

const loginRequest = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

const loginResponse: User = {
    ...loginRequest,
    id: 1,
    phone: 'any_phone',
    type: 'barber',
    name: 'any_name',
    avatar: 'avatar',
    status: 'active',
    document: 'any_document',
    created_at: 'any_value',
    updated_at: 'any_value'
}

interface SutTypes {
    sut: LoginController
    userRepositorieSpy: UserRepositorieSpy
}

class UserRepositorieSpy {
    async login(email: string): Promise<User | {}> {
        return loginResponse
    }
}

const makeSut = (): SutTypes => {
    const userRepositorieSpy = new UserRepositorieSpy()
    return {
        sut: new LoginController(userRepositorieSpy),
        userRepositorieSpy
    }
}

describe('loginController', () => {
    test('should return status 200 if login is successful', async () => {
        const { sut } = makeSut()
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return status 401 if email is invalid', async () => {
        const { sut, userRepositorieSpy } = makeSut()
        jest.spyOn(userRepositorieSpy, 'login').mockResolvedValueOnce({})
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })
})
