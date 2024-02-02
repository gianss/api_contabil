
export interface JwtHashGenerator {
    generateHash(item: any): Promise<string>
}
