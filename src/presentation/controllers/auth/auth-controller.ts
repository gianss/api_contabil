import { User } from '@/domain/protocols/user'
import { JwtHashDecoded } from '@/domain/usecases/auth'
import { GetUserTokenService } from '@/domain/usecases/users/get-user-token'

export class AuthController {
    constructor(
        private readonly jwtHashVerify: JwtHashDecoded,
        private readonly getUserTokenService: GetUserTokenService
    ) { }

    async authorize(token: string, roles: string[]): Promise<{ next: boolean, user: User | undefined }> {
        try {
            await this.jwtHashVerify.decoded(token)
            const user = await this.getUserTokenService.getUserToken(token)
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
