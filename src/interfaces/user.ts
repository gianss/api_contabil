export interface User {
    id: number
    name: string
    email: string
    phone: string
    password: string
    document: string
    avatar: string
    status: string
    type: string
    created_at: string
    updated_at: string
}

export interface AddUser {
    name: string
    email: string
    phone: string
    password: string
    document: string
    avatar: string
    status: string
    type: string
}
