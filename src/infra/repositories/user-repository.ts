import { User } from '@/domain/protocols/user'
import { db } from '@/infra/config/knexfile'

export class UserRepository {
    async login(email: string): Promise<User | undefined> {
        return await db('users').select('id', 'email', 'password', 'type', 'status').where('email', email).first()
    }
}
