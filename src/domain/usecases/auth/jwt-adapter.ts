export interface JwtHashGenerator {
    generateHash(item: any): Promise<string>
}

export interface JwtHashDecoded {
    decoded(item: any): Promise<any>
}
