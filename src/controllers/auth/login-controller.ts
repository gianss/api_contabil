import { HttpResponse } from '@/utils/protocols/http-response'
import { Login } from './protocols/login'
import { UserRepositorie } from '@/repositories/user-repositorie'
import { LoginRequest } from './protocols/login-request'
import { ok, unauthorized } from '@/utils/helpers/http-helper'

export class LoginController implements Login {
    constructor(readonly userRepositorie: UserRepositorie) { }

    async handle(request: LoginRequest): Promise<HttpResponse> {
        const login = await this.userRepositorie.login(request.email)
        if (!('id' in login)) {
            return unauthorized()
        }
        return ok('teste')
    }
}
