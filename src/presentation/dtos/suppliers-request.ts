import { User } from '@/domain/protocols/user'

export interface SuppliersRequest {
    name: string
    phone: string
    email: string
    status: string
    company_id: number
    loggedUser?: User
}
