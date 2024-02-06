export interface AddService<T, R> {
    add(request: T): Promise<R | undefined>
}
