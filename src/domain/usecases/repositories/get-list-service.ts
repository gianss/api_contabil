
export interface ListService<T> {
    getAll(request: any): Promise<T[]>
}
