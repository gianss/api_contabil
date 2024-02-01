
export interface BcryptAdapterInterface {
    compare(password: string, hash: string): Promise<boolean>
}
