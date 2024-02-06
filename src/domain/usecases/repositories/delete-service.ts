
export interface VerifyEmailService {
    verify(email: string, id?: number): Promise<boolean>
}
