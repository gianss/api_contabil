import { JwtHashDecoded, JwtHashGenerator } from '@/domain/usecases/auth'
import config from '@/infra/config/config'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements JwtHashGenerator, JwtHashDecoded {
    async generateHash(item: any): Promise<string> {
        return jwt.sign({ item }, config.jwt_key, { expiresIn: 3600 })
    }

    async decoded(token: any): Promise<any> {
        return jwt.verify(token, config.jwt_key)
    }
}
