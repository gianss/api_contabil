import { Validation } from '@/validation/protocols'
import { HashComparator, JwtHashGenerator } from '@/domain/usecases/auth'
import { unauthorized, badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/http/http-response'
import { LoginRequest } from '@/presentation/dtos/login-request'
import { AddTokenService, AuthenticationService } from '@/domain/usecases/repositories'
import { ControllerHandler } from '@/domain/usecases/controllers/controller-handle'

export class LoginController implements ControllerHandler<LoginRequest> {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly hashComparator: HashComparator,
        private readonly validation: Validation,
        private readonly jwtAdapter: JwtHashGenerator,
        private readonly addTokenService: AddTokenService
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
            const token = await this.jwtAdapter.generateHash({ id: login.id, email: login.email })
            await this.addTokenService.addToken(login.id, token)
            return ok({ token })
        } catch (error) {
            return serverError(error)
        }
    }
}
