import { db } from '@/config/knexfile'
import { User } from '@/interfaces/user'

export class UserRepositorie {
    async login(email: string): Promise<User | {}> {
        return await db('users').select('id', 'email', 'password', 'type', 'status').where('email', email).first()
    }
}
