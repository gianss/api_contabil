import config from '@/infra/config/config'
import { JwtAdapterInterface } from '@/domain/usecases/auth'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements JwtAdapterInterface {
    async generateHash(item: any): Promise<string> {
        return jwt.sign({ item }, config.jwt_key, { expiresIn: 3600 })
    }
}
