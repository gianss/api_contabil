import { User } from '@/domain/protocols/user'

export interface CustomerRequest {
    name: string
    phone: string
    email: string
    status: string
    type: string
    avatar: string
    company_id: number
    loggedUser?: User
}
