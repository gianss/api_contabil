import { faker } from '@faker-js/faker'
import { throwError } from '@/tests/mocks'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationService, HashComparator, JwtHashGenerator } from '@/domain/usecases/auth'
import { LoginController } from '@/presentation/controllers/auth/login-controller'
import { Validation } from '@/validation/protocols'
import { User } from '@/domain/protocols/user'
import { AddTokenService } from '@/domain/usecases/auth/add-token-service'

const loginRequest = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

const loginResponse: User = {
    ...loginRequest,
    id: 1,
    company_id: 1,
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
    userRepositorySpy: UserRepositorySpy
    bcryptAdapterSpy: BcryptAdapterSpy
    validationSpy: ValidationSpy
    jwtAdapterSpy: JwtAdapterSpy
}

class UserRepositorySpy implements AuthenticationService, AddTokenService {
    async login(email: string): Promise<User | undefined> {
        return loginResponse
    }

    async addToken(id: number, email: string): Promise<void> {

    }
}

class ValidationSpy implements Validation {
    validate(input: any): Error {
        return null
    }
}

class JwtAdapterSpy implements JwtHashGenerator {
    async generateHash(input: any): Promise<string> {
        return 'any_hash'
    }
}

class BcryptAdapterSpy implements HashComparator {
    async compare(password: string, hash: string): Promise<boolean> {
        return true
    }
}

const makeSut = (): SutTypes => {
    const userRepositorySpy = new UserRepositorySpy()
    const bcryptAdapterSpy = new BcryptAdapterSpy()
    const validationSpy = new ValidationSpy()
    const jwtAdapterSpy = new JwtAdapterSpy()
    return {
        sut: new LoginController(userRepositorySpy, bcryptAdapterSpy, validationSpy, jwtAdapterSpy, userRepositorySpy),
        userRepositorySpy,
        bcryptAdapterSpy,
        validationSpy,
        jwtAdapterSpy
    }
}

describe('loginController', () => {
    test('should return status 200 if login is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return a token if login  is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(loginRequest)
        expect(response.body.token).toBeDefined()
        expect(response.body.token).not.toEqual('')
    })

    test('should return status 400 if validation fail', async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, 'validate').mockReturnValue(new MissingParamError('mock'))
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 401 if email is invalid', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'login').mockResolvedValueOnce(undefined)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })

    test('should return status 401 if password is invalid', async () => {
        const { sut, bcryptAdapterSpy } = makeSut()
        jest.spyOn(bcryptAdapterSpy, 'compare').mockResolvedValueOnce(false)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })

    test('should return status 500 if userRepository thrown', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'login').mockImplementationOnce(throwError)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(500)
    })

    test('should return status 500 if addTokenRepository thrown', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'addToken').mockImplementationOnce(throwError)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(500)
    })
})
