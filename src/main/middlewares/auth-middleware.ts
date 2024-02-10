import { NextFunction, Request, Response } from 'express'
import { JwtAdapter } from '@/infra/hasher/jwt-adapter'
import { authFactoryController, loginFactoryController } from '../factories/auth-factory'

export class AuthMiddleware {
    private readonly jwtAdapter: JwtAdapter

    constructor() {
        this.jwtAdapter = new JwtAdapter()
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const loginController = loginFactoryController()
        const response = await loginController.handle(req.body)
        res.status(response.statusCode).json(response.body)
    }

    checkPermissions = (roles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const authController = authFactoryController()
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
