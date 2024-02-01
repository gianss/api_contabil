import { UserRepositorie } from '@/infra/repositories/user-repositorie'
import { JwtAdapter } from '@/infra/hasher/jwt-adapter'
import { Validation } from '@/validation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'
import { Request, Response } from 'express'
import { LoginController } from '../controllers/auth/login-controller'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'

export class AuthMiddleware {
    async login(req: Request, res: Response): Promise<void> {
        const userRepositorie = new UserRepositorie()
        const bcryptAdapter = new BcryptAdapter(10)
        const jwtAdapter = new JwtAdapter()
        const validations: Validation[] = []
        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
        const validation = new ValidationComposite(validations)
        const loginController: LoginController = new LoginController(userRepositorie, bcryptAdapter, validation, jwtAdapter)
        const response = await loginController.handle(req.body)
        res.status(response.statusCode).json(response.body)
    }
}
