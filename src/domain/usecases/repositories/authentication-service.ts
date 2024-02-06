import { User } from '@/domain/protocols/user'

export interface AuthenticationService {
    login(email: string): Promise<User | undefined>
}
