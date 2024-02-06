import { HttpResponse } from '@/presentation/http/http-response'

export interface DeleteControllerHandler {
    handle(id: number): Promise<HttpResponse>
}
