export interface UpdateService<T, R> {
    update(request: T, id: number): Promise<R | undefined>
}
