
export interface VerifyEmailUsedService {
    verifyEmail(email: string, id?: number): Promise<boolean>
}
