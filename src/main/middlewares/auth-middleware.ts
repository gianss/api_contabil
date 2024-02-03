import { NextFunction, Request, Response } from 'express'
import { JwtAdapter } from '@/infra/hasher/jwt-adapter'
import { EmailValidatorAdapter } from '@/validation/validators/email-validator-adapter'
import { UserRepository } from '@/infra/repositories/user-repository'
import { BcryptAdapter } from '@/infra/cryptography/bcrypter-adapter'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { LoginController } from '@/presentation/controllers/auth/login-controller'
import { AuthController } from '@/presentation/controllers/auth/auth-controller'

export class AuthMiddleware {
    private readonly userRepository: UserRepository
    private readonly jwtAdapter: JwtAdapter

    constructor() {
        this.userRepository = new UserRepository()
        this.jwtAdapter = new JwtAdapter()
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const bcryptAdapter = new BcryptAdapter(10)
        const emailValidator = new EmailValidatorAdapter()
        const validations = [
            new RequiredFieldValidation('email'),
            new RequiredFieldValidation('password'),
            new EmailValidation('email', emailValidator)
        ]
        const validation = new ValidationComposite(validations)
        const loginController = new LoginController(
            this.userRepository,
            bcryptAdapter,
            validation,
            this.jwtAdapter,
            this.userRepository
        )
        const response = await loginController.handle(req.body)
        res.status(response.statusCode).json(response.body)
    }

    checkPermissions = (roles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const authController = new AuthController(this.jwtAdapter, this.userRepository)
            const response = await authController.authorize(req.headers['x-access-token']?.toString(), roles)
            if (!response.next) {
                res.status(401).json({ message: 'Sem autorização para acessar a rota' })
            } else {
                req.user = response.user
                next()
            }
        }
    }
}
