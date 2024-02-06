import { User } from '@/domain/protocols/user'
import { AddTokenService, AuthenticationService, GetByTokenService } from '@/domain/usecases/repositories'
import { db } from '@/infra/config/knexfile'

export class UserRepository implements AuthenticationService, AddTokenService, GetByTokenService<User> {
    async login(email: string): Promise<User | undefined> {
        return await db('users').select('*').where('email', email).first()
    }

    async addToken(id: number, token: string): Promise<void> {
        await db('tokens').insert({ user_id: id, token: token })
    }

    async getByToken(token: string): Promise<User> {
        return await db('tokens').select('users.*')
            .join('users', 'users.id', 'tokens.user_id')
            .where('token', token).first()
    }
}
