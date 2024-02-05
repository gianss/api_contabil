
export interface VerifyEmailCustomerService {
    verify(email: string, id?: number): Promise<boolean>
}
