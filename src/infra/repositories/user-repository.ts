import { User } from '@/domain/protocols/user'
import { AddTokenService, AuthenticationService, GetByTokenService } from '@/domain/usecases/repositories'
import { db } from '@/infra/config/knexfile'

export class UserAuthenticationRepository implements AuthenticationService {
    async login(email: string): Promise<User | undefined> {
        return await db('users').select('*').where('email', email).first()
    }
}

export class UserTokenAddRepository implements AddTokenService {
    async addToken(userId: number, token: string): Promise<void> {
        await db('tokens').insert({ user_id: userId, token: token })
    }
}

export class UserByTokenRepository implements GetByTokenService<User> {
    async getByToken(token: string): Promise<User> {
        return await db('tokens').select('users.*')
            .join('users', 'users.id', 'tokens.user_id')
            .where('token', token).first()
    }
}
