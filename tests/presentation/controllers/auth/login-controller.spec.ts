import { faker } from '@faker-js/faker'
import { throwError } from '@/tests/mocks'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationService, BcryptCompareAdapterInterface, JwtAdapterInterface } from '@/domain/protocols/auth'
import { User } from '@/presentation/interfaces/user'
import { LoginController } from '@/presentation/controllers/auth/login-controller'
import { HttpResponse } from '@/presentation/http/http-response'
import { Validation } from '@/validation/protocols'

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
    bcryptAdapterSpy: BcryptAdapterSpy
    validationSpy: ValidationSpy
    jwtAdapterSpy: JwtAdapterSpy
}

class UserRepositorieSpy implements AuthenticationService {
    async login(email: string): Promise<User | undefined> {
        return loginResponse
    }
}

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

class JwtAdapterSpy implements JwtAdapterInterface {
    async generateHash(input: any): Promise<string> {
        return 'any_hash'
    }
}

class BcryptAdapterSpy implements BcryptCompareAdapterInterface {
    async compare(password: string, hash: string): Promise<boolean> {
        return true
    }
}

const makeSut = (): SutTypes => {
    const userRepositorieSpy = new UserRepositorieSpy()
    const bcryptAdapterSpy = new BcryptAdapterSpy()
    const validationSpy = new ValidationSpy()
    const jwtAdapterSpy = new JwtAdapterSpy()
    return {
        sut: new LoginController(userRepositorieSpy, bcryptAdapterSpy, validationSpy, jwtAdapterSpy),
        userRepositorieSpy,
        bcryptAdapterSpy,
        validationSpy,
        jwtAdapterSpy
    }
}

describe('loginController', () => {
    test('should return status 200 if login is successful', async () => {
        const { sut } = makeSut()
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return status 400 if validation fail', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 401 if email is invalid', async () => {
        const { sut, userRepositorieSpy } = makeSut()
        jest.spyOn(userRepositorieSpy, 'login').mockResolvedValueOnce(undefined)
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })

    test('should return status 401 if password is invalid', async () => {
        const { sut, bcryptAdapterSpy } = makeSut()
        jest.spyOn(bcryptAdapterSpy, 'compare').mockResolvedValueOnce(false)
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })

    test('should return status 500 if thrown', async () => {
        const { sut, userRepositorieSpy } = makeSut()
        jest.spyOn(userRepositorieSpy, 'login').mockImplementationOnce(throwError)
        const response: HttpResponse = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(500)
    })
})
