export interface AddTokenService {
    addToken(iduser: number, token: string): Promise<void>
}
