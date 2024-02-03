import { User } from '@/domain/protocols/user'
import { AuthenticationService } from '@/domain/usecases/auth'
import { AddTokenService } from '@/domain/usecases/auth/add-token-service'
import { GetUserTokenService } from '@/domain/usecases/users/get-user-token'
import { db } from '@/infra/config/knexfile'

export class UserRepository implements AuthenticationService, AddTokenService, GetUserTokenService {
    async login(email: string): Promise<User | undefined> {
        return await db('users').select('*').where('email', email).first()
    }

    async addToken(id: number, token: string): Promise<void> {
        await db('tokens').insert({ user_id: id, token: token })
    }

    async getUserToken(token: string): Promise<User> {
        return await db('tokens').select('users.*')
            .join('users', 'users.id', 'tokens.user_id')
            .where('token', token).first()
    }
}
