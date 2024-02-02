import { User } from '@/domain/protocols/user'
import { AuthenticationService } from '@/domain/usecases/auth'
import { AddTokenService } from '@/domain/usecases/auth/add-token-service'
import { db } from '@/infra/config/knexfile'

export class UserRepository implements AuthenticationService, AddTokenService {
    async login(email: string): Promise<User | undefined> {
        return await db('users').select('id', 'email', 'password', 'type', 'status').where('email', email).first()
    }

    async addToken(id: number, token: string): Promise<void> {
        await db('users').insert({ user_id: id, token: token })
    }
}
