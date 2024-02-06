import { faker } from '@faker-js/faker'
import { JwtHashDecoded } from '@/domain/usecases/auth'
import { AuthController } from '@/presentation/controllers/auth/auth-controller'
import { throwError } from '@/tests/mocks'
import { User } from '@/domain/protocols/user'
import { GetByTokenService } from '@/domain/usecases/repositories'

const login = { id: 1, email: 'gian_ss@live.com' }

interface SutTypes {
    sut: AuthController
    hashDecodeSpy: HashDecodeSpy
    userRepositorySpy: UserRepositorySpy
}

const loginResponse: User = {
    id: 1,
    email: faker.internet.email(),
    password: faker.internet.password(),
    company_id: 1,
    phone: 'any_phone',
    type: 'administrator',
    name: 'any_name',
    avatar: 'avatar',
    status: 'active',
    document: 'any_document',
    created_at: 'any_value',
    updated_at: 'any_value'
}

class UserRepositorySpy implements GetByTokenService<User> {
    async getByToken(email: string): Promise<User | undefined> {
        return loginResponse
    }
}

class HashDecodeSpy implements JwtHashDecoded {
    async decoded(item: any): Promise<any> {
        return { data: login }
    }
}

const makeSut = (): SutTypes => {
    const hashDecodeSpy = new HashDecodeSpy()
    const userRepositorySpy = new UserRepositorySpy()
    return {
        sut: new AuthController(hashDecodeSpy, userRepositorySpy),
        hashDecodeSpy,
        userRepositorySpy
    }
}

describe('AuthController Authorization', () => {
    test('should return true if user has permission', async () => {
        const { sut } = makeSut()
        const hasPermission = await sut.authorize('any_token', ['administrator'])
        expect(hasPermission.next).toEqual(true)
    })

    test('should return false if hash decoding fails', async () => {
        const { sut, hashDecodeSpy } = makeSut()
        jest.spyOn(hashDecodeSpy, 'decoded').mockImplementationOnce(throwError)
        const hasPermission = await sut.authorize('any_token', ['administrator'])
        expect(hasPermission.next).toEqual(false)
    })

    test('should return false if getUserTokenService returns undefined', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getByToken').mockRejectedValueOnce(undefined)
        const hasPermission = await sut.authorize('any_token', ['administrator'])
        expect(hasPermission.next).toEqual(false)
    })

    test('should return false if permissions n are failed', async () => {
        const { sut } = makeSut()
        const hasPermission = await sut.authorize('any_token', ['admin'])
        expect(hasPermission.next).toEqual(false)
    })
})
