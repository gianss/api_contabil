import { LoginRequest } from '@/presentation/dtos/login-request'
import { HttpResponse } from '@/presentation/http/http-response'

export interface LoginHandler {
    handle(request: LoginRequest): Promise<HttpResponse>
}
