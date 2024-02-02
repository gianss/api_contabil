export interface AddCustomerRequest {
    name: string
    phone: string
    email: string
    status: string
    type: string
    avatar: string
    company_id: number
}

export interface UpdateCustomerRequest extends AddCustomerRequest {
    id: number
}
