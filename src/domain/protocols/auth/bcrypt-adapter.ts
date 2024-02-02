
export interface CompareHashInterface {
    compare(password: string, hash: string): Promise<boolean>
}

export interface HashInterface {
    hash(password: string): Promise<string>
}
