import { NextFunction, Request, Response } from 'express'
import { JwtAdapter } from '@/infra/hasher/jwt-adapter'
import { Validation } from '@/validation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'
import { LoginController } from '../../presentation/controllers/auth/login-controller'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { UserRepository } from '@/infra/repositories/user-repository'
import { AuthController } from '@/presentation/controllers/auth/auth-controller'

export class AuthMiddleware {
    async login(req: Request, res: Response): Promise<void> {
        const userRepository = new UserRepository()
        const bcryptAdapter = new BcryptAdapter(10)
        const jwtAdapter = new JwtAdapter()
        const validations: Validation[] = []
        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
        const validation = new ValidationComposite(validations)
        const loginController: LoginController = new LoginController(userRepository, bcryptAdapter, validation, jwtAdapter, userRepository)
        const response = await loginController.handle(req.body)
        res.status(response.statusCode).json(response.body)
    }

    checkPermissions(roles: string[]) {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const userRepository = new UserRepository()
            const jwtAdapter = new JwtAdapter()

            const authController = new AuthController(jwtAdapter, userRepository)
            const response = await authController.authorize(req.headers['x-access-token']?.toString(), roles)
            if (!response.next) {
                res.status(401).json({ message: 'Sem autorização para acessar a rota' })
            }
            req.user = response.user
            next()
        }
    }
}
