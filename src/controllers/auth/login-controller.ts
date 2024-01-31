import { HttpResponse } from '@/utils/protocols/http-response'
import { LoginImplemetation } from './protocols/login-implemetation'

export class LoginController implements LoginImplemetation {
    async handle(request: any): Promise<HttpResponse> {
        return {
            statusCode: 200,
            body: {}
        }
    }
}
