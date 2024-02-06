
export interface GetIdService<T> {
    getId(id: number): Promise<T | undefined>
}
