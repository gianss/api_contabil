import { LoginRequest, HttpResponse } from '../../interfaces/usecases/'
import { badRequest, ok, serverError, unauthorized } from '@/utils/helpers/http-helper'
import { Validation } from '@/validation/protocols'
import { BcryptAdapterInterface, JwtAdapterInterface, AuthenticationService, Login } from '@/interfaces/protocols/auth/'

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
            console.log(error)
            return serverError(error)
        }
    }
}
