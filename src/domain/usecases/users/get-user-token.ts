import { User } from '@/domain/protocols/user'

export interface GetUserTokenService {
    getUserToken(token: string): Promise<User | undefined>
}
