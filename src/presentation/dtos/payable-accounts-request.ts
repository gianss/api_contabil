export interface PayableAccountRequest {
    observation: string
    amount: number
    frequency: number
    due_date: string | Date
    type: string
    status: string
    supplier_id: number
}
