export interface GetByTokenService<T> {
    getByToken(token: string): Promise<T | undefined>
}
