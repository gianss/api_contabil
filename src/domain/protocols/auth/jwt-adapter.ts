
export interface JwtAdapterInterface {
    generateHash(item: any): Promise<string>
}
