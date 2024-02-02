import { HttpResponse } from '@/presentation/http/http-response'

export interface LoginHandler {
    handle(request: any): Promise<HttpResponse>
}
