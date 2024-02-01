import { User } from '@/domain/usecases/user'

export interface AuthenticationService {
    login(email: string): Promise<User | undefined>
}
