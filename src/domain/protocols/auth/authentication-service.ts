import { User } from '@/presentation/interfaces/user'

export interface AuthenticationService {
    login(email: string): Promise<User | undefined>
}
