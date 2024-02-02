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

export interface UpdateUser extends AddUser {
    id: number
}
