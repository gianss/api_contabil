
export interface BcryptCompareAdapterInterface {
    compare(password: string, hash: string): Promise<boolean>
}

export interface BcryptHashAdapterInterface {
    hash(password: string): Promise<string>
}
