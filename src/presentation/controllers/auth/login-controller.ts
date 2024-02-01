import { Validation } from '@/validation/protocols'
import { BcryptAdapterInterface, JwtAdapterInterface, AuthenticationService, Login } from '@/domain/protocols/auth'
import { unauthorized, badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { LoginRequest } from '@/presentation/interfaces/login-request'

export class LoginController implements Login {
    constructor(
        readonly authenticationService: AuthenticationService,
        readonly bcryptAdapter: BcryptAdapterInterface,
        private readonly validation: Validation,
        private readonly jwtAdapter: JwtAdapterInterface
    ) { }

    async handle(request: LoginRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const login = await this.authenticationService.login(request.email)
            if (!login) {
                return unauthorized()
            }
            const isValid = await this.bcryptAdapter.compare(request.password, login.password)
            if (!isValid) {
                return unauthorized()
            }
            return ok(this.jwtAdapter.generateHash({ id: login.id, email: login.email }))
        } catch (error) {
            return serverError(error)
        }
    }
}
