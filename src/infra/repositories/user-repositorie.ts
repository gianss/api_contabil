import { db } from '@/infra/config/knexfile'
import { User } from '@/domain/usecases/user'

export class UserRepositorie {
    async login(email: string): Promise<User | undefined> {
        return await db('users').select('id', 'email', 'password', 'type', 'status').where('email', email).first()
    }
}
