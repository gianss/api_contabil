import { User } from '@/domain/protocols/user'

export interface AuthControllerHandler {
    authorize(token: string, roles: string[]): Promise<{ next: boolean, user?: User }>
}
