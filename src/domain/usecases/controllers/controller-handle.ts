import { HttpResponse } from '@/presentation/http/http-response'

export interface ControllerHandler<T> {
    handle(request: T): Promise<HttpResponse>
}
