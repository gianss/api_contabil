import { Validation } from '@/validation/protocols'
import { HashComparator, JwtHashGenerator, AuthenticationService, LoginHandler } from '@/domain/usecases/auth'
import { unauthorized, badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { LoginRequest } from '@/presentation/dtos/login-request'

export class LoginController implements LoginHandler {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly hashComparator: HashComparator,
        private readonly validation: Validation,
        private readonly jwtAdapter: JwtHashGenerator
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
            const isValid = await this.hashComparator.compare(request.password, login.password)
            if (!isValid) {
                return unauthorized()
            }
            return ok({ token: await this.jwtAdapter.generateHash({ id: login.id, email: login.email }) })
        } catch (error) {
            return serverError(error)
        }
    }
}
