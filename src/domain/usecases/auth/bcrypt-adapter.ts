
export interface HashComparator {
    compare(password: string, hash: string): Promise<boolean>
}

export interface HashGenerator {
    hash(password: string): Promise<string>
}
