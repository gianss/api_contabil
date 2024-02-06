import { User } from '@/domain/protocols/user'
import { JwtHashDecoded } from '@/domain/usecases/auth'
import { GetByTokenService } from '@/domain/usecases/repositories'

export class AuthController {
    constructor(
        private readonly jwtHashVerify: JwtHashDecoded,
        private readonly getUserTokenService: GetByTokenService<User>
    ) { }

    async authorize(token: string, roles: string[]): Promise<{ next: boolean, user: User | undefined }> {
        try {
            await this.jwtHashVerify.decoded(token)
            const user = await this.getUserTokenService.getByToken(token)
            if (!user) {
                return {
                    next: false,
                    user: undefined
                }
            }
            if (!roles.includes(user.type)) {
                return {
                    next: false,
                    user: undefined
                }
            }
            return {
                next: true,
                user: user
            }
        } catch (error) {
            return {
                next: false,
                user: undefined
            }
        }
    }
}
