
export interface DeleteItemService<T> {
    delete(id: number): Promise<T>
}
