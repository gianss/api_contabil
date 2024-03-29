export interface User {
    id: number
    company_id: number
    name: string
    email: string
    phone: string
    password: string
    document: string
    avatar: string
    status: string
    type: string
    created_at: string | number | Date
    updated_at: string | number | Date
}
