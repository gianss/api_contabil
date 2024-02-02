import { JwtHashGenerator } from '@/domain/usecases/auth'
import config from '@/infra/config/config'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements JwtHashGenerator {
    async generateHash(item: any): Promise<string> {
        return jwt.sign({ item }, config.jwt_key, { expiresIn: 3600 })
    }
}
