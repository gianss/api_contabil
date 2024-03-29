import { User } from '@/domain/protocols/user'

export interface PayableAccountRequest {
    observation: string
    amount: number
    frequency: number
    due_date: string | Date
    status: string
    supplier_id: number
    loggedUser?: User
}
