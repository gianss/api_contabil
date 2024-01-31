import { User } from '@/interfaces/usecases/user'

export interface AuthenticationService {
    login(email: string): Promise<User | {}>
}
