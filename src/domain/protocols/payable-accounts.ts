export interface PayableAccounts {
    id: number
    observation: string
    amount: number
    frequency: number
    due_date: string | Date
    status: string
    supplier_id: number
    company_id?: number
    created_at: string | number | Date
    updated_at: string | number | Date
}
