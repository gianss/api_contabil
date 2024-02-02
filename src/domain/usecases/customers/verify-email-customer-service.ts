
export interface VerifyEmailCustomerService {
    verify(email: string): Promise<boolean>
}
