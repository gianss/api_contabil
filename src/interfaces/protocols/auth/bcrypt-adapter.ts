
export interface BcryptAdapter {
    compare(password: string, hash: string): boolean
}
