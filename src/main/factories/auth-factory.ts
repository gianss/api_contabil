import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { JwtAdapter } from '@/infra/hasher/jwt-adapter'
import { UserAuthenticationRepository, UserByTokenRepository, UserTokenAddRepository } from '@/infra/repositories/user-repository'
import { AuthController } from '@/presentation/controllers/auth/auth-controller'
import { LoginController } from '@/presentation/controllers/auth/login-controller'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'

export const loginFactoryController = (): LoginController => {
    const bcryptAdapter = new BcryptAdapter(10)
    const emailValidator = new EmailValidatorAdapter()
    const validations = [
        new RequiredFieldValidation('email'),
        new RequiredFieldValidation('password'),
        new EmailValidation('email', emailValidator)
    ]
    const validation = new ValidationComposite(validations)
    const jwtAdapter = new JwtAdapter()
    const userAuthenticationRepository = new UserAuthenticationRepository()
    const userTokenAddRepository = new UserTokenAddRepository()
    return new LoginController(
        userAuthenticationRepository,
        bcryptAdapter,
        validation,
        jwtAdapter,
        userTokenAddRepository
    )
}

export const authFactoryController = (): AuthController => {
    const jwtAdapter = new JwtAdapter()
    const userByTokenRepository = new UserByTokenRepository()
    return new AuthController(jwtAdapter, userByTokenRepository)
}
