import { HttpResponse } from '@/presentation/http/http-response'

export interface UpdateControllerHandler<T> {
    handle(request: T, id: number): Promise<HttpResponse>
}
